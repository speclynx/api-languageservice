#!/usr/bin/env bash
#
# Searches the tracked tree for the names this project used before it was
# published: the old package name, the old repository name, the old monorepo
# name, and the homepage URL naming an organisation that does not exist. It then
# searches the documents that state the project's identity for bare ApiDOM,
# which is the upstream project this service is built on and not this project's
# name.
#
# The second search exists because the first cannot work on its own. A grep for
# the package name will never find `.github/SECURITY.md` opening "an exploitable
# security issue in ApiDOM monorepo", or an issue template asking reporters for
# an "ApiDOM version" — and those are the first documents a public contributor
# reads. It is scoped to the identity surface rather than to the whole tree
# because in the source and the tests ApiDOM is a domain term: the document
# model the service parses into, the upstream packages it imports, and the
# public constants and type names built on both.
#
# Fails when a finding is not allowlisted, and equally when an allowlist rule
# matches nothing, so the table cannot rot in either direction.

set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"

allowlist="scripts/retired-identifiers-allow.txt"

# package-lock.json is generated and names every dependency; docs/repo-publication
# holds the publication plan and its state, which the Phase 2 history filter
# removes from every commit of the copy that is pushed.
retired="$(
  git grep -nIiE 'apidom-ls|apidom-internal|apidom-monorepo|speclynx-internal' -- \
    . ':!package-lock.json' ':!docs/repo-publication' || true
)"

identity="$(
  git grep -nIi 'apidom' -- \
    README.md CONTRIBUTING.md CODE_OF_CONDUCT.md NOTICE CLAUDE.md CHANGELOG.md \
    package.json lerna.json .github docs 'packages/*/README.md' \
    'packages/*/package.json' 'packages/*/CHANGELOG.md' ':!docs/repo-publication' || true
)"

findings="$(printf '%s\n%s\n' "$retired" "$identity" | grep -v '^$' | sort -u || true)"

if [ -z "$findings" ]; then
  echo "check-retired-identifiers: nothing matched at all, which cannot be right." >&2
  exit 1
fi

# Read the allowlist into parallel arrays of pattern and reason, dropping blank
# lines and comments.
patterns=()
reasons=()
while IFS=$'\t' read -r pattern reason; do
  case "$pattern" in '' | '#'*) continue ;; esac
  patterns+=("$pattern")
  reasons+=("$reason")
done < "$allowlist"

remaining="$findings"
unused=()
for index in "${!patterns[@]}"; do
  matched="$(printf '%s\n' "$remaining" | grep -cE -- "${patterns[$index]}" || true)"
  if [ "$matched" -eq 0 ]; then
    unused+=("${patterns[$index]}	${reasons[$index]}")
  fi
  remaining="$(printf '%s\n' "$remaining" | grep -vE -- "${patterns[$index]}" || true)"
done

status=0

if [ -n "$remaining" ]; then
  echo "Retired identifiers found in the tree:" >&2
  printf '%s\n' "$remaining" >&2
  echo >&2
  echo "Rename them, or add a rule to $allowlist with the reason it is correct." >&2
  status=1
fi

if [ "${#unused[@]}" -gt 0 ]; then
  echo "Allowlist rules in $allowlist that matched nothing:" >&2
  printf '%s\n' "${unused[@]}" >&2
  echo >&2
  echo "The identifier they excused is gone. Remove the rule." >&2
  status=1
fi

if [ "$status" -eq 0 ]; then
  echo "check-retired-identifiers: no retired identifiers outside the allowlist."
fi

exit "$status"
