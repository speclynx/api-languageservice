#!/usr/bin/env bash
#
# Asserts that versioning changed the published manifests in exactly the way the
# copyright review was told it would, and in no other way.
#
# The approval taken at the end of Phase 1 covers one named transformation: both
# manifests and lerna.json move from the source version to the target version,
# and the compatibility package's dependency on the renamed package moves from
# ^source to ^target. Calling that "version-only" would be wrong — lerna rewrites
# the dependency range too — and calling any dependency change an invalidation
# would invalidate the approval it had just granted. Naming the expected
# transformation is what resolves it.
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
allowed_dependency='^[-+][[:space:]]*"@speclynx/api-languageservice": "\^('"$SOURCE_VERSION"'|'"$TARGET_VERSION"')"$'

unexpected="$(printf '%s\n' "$changed" | grep -vE "$allowed" | grep -vE "$allowed_dependency" || true)"

if [ -n "$unexpected" ]; then
  echo "Versioning changed the published manifests beyond the approved transformation:" >&2
  printf '%s\n' "$unexpected" >&2
  echo >&2
  echo "The Phase 1 copyright approval covers $SOURCE_VERSION -> $TARGET_VERSION in the" >&2
  echo "manifests and in the compatibility package's dependency range, and nothing else." >&2
  exit 1
fi

echo "check-release-transformation: $SOURCE_VERSION -> $TARGET_VERSION, and nothing else."
