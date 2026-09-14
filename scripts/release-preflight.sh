#!/usr/bin/env bash
#
# Resolves and validates the version a release will produce, in a job that holds
# no token and no publishing credential, so that what the environment reviewer
# approves is a version already resolved and printed rather than one computed
# after they clicked.
#
# The requested version arrives in REQUESTED_VERSION rather than interpolated
# into this script, because the job that acts on it can write to main and, in
# the publish step, reach the registry.

set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"
# shellcheck source=scripts/release-state.sh
. scripts/release-state.sh

requested="${REQUESTED_VERSION:-}"
current="$(workspace_version)"
echo "The workspace is at $current."

if [ -n "$requested" ]; then
  if ! is_stable_semver "$requested"; then
    echo "Requested version '$requested' is not a plain x.y.z release version." >&2
    echo "Ranges, prereleases and build metadata are not accepted here." >&2
    exit 1
  fi
  resolved="$requested"
  echo "Releasing the requested version $resolved."
else
  # lerna 10 dropped --dry-run from `lerna version`, so the bump can no longer be
  # read back out of lerna. conventional-recommended-bump is the library lerna
  # drives to compute it, so asking it directly, with the preset lerna.json
  # names, reaches the answer lerna would have reached. The binary is invoked by
  # path rather than through npx so that a missing dependency fails here instead
  # of being fetched from the network in the middle of a release.
  #
  # Nothing recomputes this later: the version job is handed the resolved number
  # and passes it to `lerna version` explicitly, so the two cannot diverge.
  echo "No version requested; deriving the bump from the conventional commits."
  preset="$(node -p 'require("./lerna.json").changelogPreset || "angular"')"
  release_type="$(./node_modules/.bin/conventional-recommended-bump -p "$preset" | tr -d '[:space:]')"

  case "$release_type" in
    major | minor | patch) ;;
    *)
      echo "Could not derive a release type from the commits since the last tag." >&2
      echo "conventional-recommended-bump produced: '$release_type'" >&2
      exit 1
      ;;
  esac

  resolved="$(node -e '
    const [major, minor, patch] = process.argv[1].split(".").map(Number);
    const bumped = {
      major: [major + 1, 0, 0],
      minor: [major, minor + 1, 0],
      patch: [major, minor, patch + 1],
    }[process.argv[2]];
    process.stdout.write(bumped.every(Number.isInteger) ? bumped.join(".") : "");
  ' "$current" "$release_type")"

  if ! is_stable_semver "$resolved"; then
    echo "Applying a $release_type bump to $current did not produce a release version." >&2
    echo "It produced: '$resolved'" >&2
    exit 1
  fi
  echo "Conventional commits imply a $release_type bump: $resolved."
fi

if ! is_greater_version "$resolved" "$current"; then
  echo "$resolved does not move forward from $current." >&2
  exit 1
fi

# The rename release, gated on the state that identifies it rather than on a
# constant that would have to be removed afterwards. 2.12.0 is the last version
# published under the old package name; the release that leaves it is the one
# that introduces the renamed package and its compatibility wrapper, and the
# plan fixes that version at 2.13.0.
if [ "$current" = "2.12.0" ] && [ "$resolved" != "2.13.0" ]; then
  echo "The first release after the rename is 2.13.0, not $resolved." >&2
  exit 1
fi

for package in "${RELEASE_PACKAGES[@]}"; do
  published="$(registry_version "$package" "$resolved")"
  if [ -n "$published" ]; then
    echo "$package@$resolved is already on the registry. Published versions are immutable." >&2
    exit 1
  fi
  echo "$package: $resolved is unpublished; latest is '$(registry_dist_tag "$package" latest)'."
done

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  {
    echo "version=$resolved"
    echo "source-version=$current"
    for package in "${RELEASE_PACKAGES[@]}"; do
      echo "latest-${package##*/}=$(registry_dist_tag "$package" latest)"
    done
  } >> "$GITHUB_OUTPUT"
fi

echo "release-preflight: $current -> $resolved, approved for release."
