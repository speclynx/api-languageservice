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
  # lerna computes its bump from lerna.json, so the only trustworthy source for
  # the derived version is lerna itself.
  echo "No version requested; asking lerna what the conventional commits imply."
  resolved="$(
    npx lerna version --conventional-commits --no-private --yes --force-publish --dry-run 2>&1 |
      sed -n 's/^ - .*: .* => \([0-9][0-9.]*\)$/\1/p' | sort -u
  )"

  if ! is_stable_semver "$resolved"; then
    echo "Could not read a single stable version out of lerna's dry run." >&2
    echo "It produced: '$resolved'" >&2
    exit 1
  fi
  echo "Conventional commits imply $resolved."
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
