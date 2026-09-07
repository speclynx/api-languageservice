#!/usr/bin/env bash
#
# The same facts the preflight established, re-read in the protected job
# immediately before it mutates anything. Environment approval makes the gap
# between the two real rather than theoretical: a run can sit waiting for a
# reviewer while main, the tags or the registry move underneath it.
#
# Everything it compares against arrives in the environment, from the preflight's
# outputs, so a mismatch fails closed rather than being resolved in favour of
# whichever value was read most recently.

set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"
# shellcheck source=scripts/release-state.sh
. scripts/release-state.sh

: "${APPROVED_VERSION:?the version the preflight resolved}"
: "${APPROVED_SOURCE_VERSION:?the version the workspace was at when the preflight ran}"
: "${APPROVED_SHA:?the commit the preflight ran against}"

failures=0
fail() {
  echo "$1" >&2
  failures=$((failures + 1))
}

head_sha="$(git rev-parse HEAD)"
[ "$head_sha" = "$APPROVED_SHA" ] ||
  fail "Checked out $head_sha, but the preflight approved $APPROVED_SHA."

git fetch --quiet origin main
main_sha="$(git rev-parse origin/main)"
[ "$main_sha" = "$APPROVED_SHA" ] ||
  fail "origin/main has moved to $main_sha since the preflight approved $APPROVED_SHA."

current="$(workspace_version)"
[ "$current" = "$APPROVED_SOURCE_VERSION" ] ||
  fail "The workspace is at $current, but the preflight read $APPROVED_SOURCE_VERSION."

git fetch --quiet --tags origin
if git rev-parse --verify --quiet "refs/tags/v$APPROVED_VERSION" > /dev/null; then
  fail "Tag v$APPROVED_VERSION already exists. This release has already been versioned."
fi

for package in "${RELEASE_PACKAGES[@]}"; do
  published="$(registry_version "$package" "$APPROVED_VERSION")"
  [ -z "$published" ] ||
    fail "$package@$APPROVED_VERSION appeared on the registry after the preflight ran."

  approved_latest_name="APPROVED_LATEST_${package##*/}"
  approved_latest_name="${approved_latest_name//-/_}"
  approved_latest="${!approved_latest_name-}"
  latest="$(registry_dist_tag "$package" latest)"
  [ "$latest" = "$approved_latest" ] ||
    fail "$package latest is now '$latest'; the preflight saw '$approved_latest'."
done

if [ "$failures" -gt 0 ]; then
  echo "release-recheck: $failures mismatch(es) since approval. Nothing was changed." >&2
  exit 1
fi

echo "release-recheck: the state the reviewer approved is still the state on disk."
