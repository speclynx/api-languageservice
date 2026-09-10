#!/usr/bin/env bash
#
# Asserts that versioning changed the published manifests in exactly the way the
# copyright review was told it would, and in no other way.
#
# The approval covers one named transformation: the manifest and lerna.json move
# from the source version to the target version, and nothing else.
#
# While the compatibility wrapper was in the workspace this also had to allow
# lerna rewriting its dependency range on the renamed package. That allowance is
# gone with the wrapper. It was tempting to keep it against a future second
# package, but it is not free: the rule is line-oriented, so it would accept an
# added or removed dependency line as readily as a rewritten one, in a gate whose
# entire promise is that only approved version movement passes. Design it again
# when a second package actually exists.
#
# Anything else — code, bundled dependencies, recovered licence text, package
# contents — invalidates the approval, which means regenerating and re-approving
# rather than publishing.

set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"

: "${SOURCE_VERSION:?the version the workspace was at before lerna version ran}"
: "${TARGET_VERSION:?the version being released}"
base="${BASE_REF:-HEAD~1}"
head="${HEAD_REF:-HEAD}"

changed="$(
  git diff --unified=0 "$base" "$head" -- lerna.json 'packages/*/package.json' |
    grep -E '^[-+]' | grep -vE '^(\+\+\+|---)' || true
)"

if [ -z "$changed" ]; then
  echo "Versioning changed no manifest at all between $base and $head." >&2
  exit 1
fi

allowed='^[-+][[:space:]]*"version": "('"$SOURCE_VERSION"'|'"$TARGET_VERSION"')",?$'

unexpected="$(printf '%s\n' "$changed" | grep -vE "$allowed" || true)"

if [ -n "$unexpected" ]; then
  echo "Versioning changed the published manifests beyond the approved transformation:" >&2
  printf '%s\n' "$unexpected" >&2
  echo >&2
  echo "The Phase 1 copyright approval covers $SOURCE_VERSION -> $TARGET_VERSION in the" >&2
  echo "manifest, and nothing else." >&2
  exit 1
fi

echo "check-release-transformation: $SOURCE_VERSION -> $TARGET_VERSION, and nothing else."
