#!/usr/bin/env bash
#
# The facts a release is allowed to depend on, read the same way by the
# unprivileged preflight and by the protected job that re-reads them
# immediately before it mutates anything. Sourced, not run.

# The published packages, in the order the release publishes them.
RELEASE_PACKAGES=('@speclynx/api-languageservice')

# The version the workspace sits at, asserted to be one value rather than three.
# lerna computes its conventional-commits bump from lerna.json, so a manifest
# that has drifted from it produces a version nobody asked for.
workspace_version() {
  local lerna_version drift
  lerna_version="$(node -p 'require("./lerna.json").version')"

  drift="$(node -e "
    const fs = require('node:fs');
    const path = require('node:path');
    const wanted = new Set(process.argv.slice(1));
    const drift = [];
    for (const entry of fs.readdirSync('packages')) {
      const manifest = path.join('packages', entry, 'package.json');
      if (!fs.existsSync(manifest)) continue;
      const { name, version } = JSON.parse(fs.readFileSync(manifest, 'utf8'));
      if (wanted.delete(name) && version !== '$lerna_version') {
        drift.push(name + ' is at ' + version);
      }
    }
    for (const missing of wanted) drift.push(missing + ' is not in the workspace');
    process.stdout.write(drift.join('; '));
  " "${RELEASE_PACKAGES[@]}")"

  if [ -n "$drift" ]; then
    echo "lerna.json is at $lerna_version but $drift." >&2
    return 1
  fi

  printf '%s' "$lerna_version"
}

# The version already on the registry, or the empty string when the registry has
# no such version. A network failure is not an absence, so anything other than a
# clean answer or a clean 404 fails.
registry_version() {
  local package="$1" version="$2" output status
  set +e
  output="$(npm view "$package@$version" version --json 2>&1)"
  status=$?
  set -e

  if [ "$status" -eq 0 ]; then
    printf '%s' "$output" | tr -d '"[]\n '
    return 0
  fi

  if printf '%s' "$output" | grep -q 'E404'; then
    printf ''
    return 0
  fi

  echo "npm view $package@$version failed for a reason other than absence:" >&2
  echo "$output" >&2
  return 1
}

# The version a dist-tag points at, or the empty string when the package does
# not exist yet.
registry_dist_tag() {
  local package="$1" tag="$2" output status
  set +e
  output="$(npm view "$package" "dist-tags.$tag" 2>&1)"
  status=$?
  set -e

  if [ "$status" -eq 0 ]; then
    printf '%s' "$output" | tr -d '\n '
    return 0
  fi

  if printf '%s' "$output" | grep -q 'E404'; then
    printf ''
    return 0
  fi

  echo "npm view $package dist-tags.$tag failed for a reason other than absence:" >&2
  echo "$output" >&2
  return 1
}

# A normalised stable semver and nothing else. Rejects ranges, prereleases,
# build metadata, leading dashes, whitespace and shell metacharacters in one
# pattern, because the value reaches a job holding a token that can write to
# main and a credential that can publish.
is_stable_semver() {
  printf '%s' "$1" | grep -qE '^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$'
}

# True when the first argument is strictly greater than the second.
is_greater_version() {
  [ "$1" != "$2" ] && [ "$(printf '%s\n%s\n' "$1" "$2" | sort -V | tail -1)" = "$1" ]
}
