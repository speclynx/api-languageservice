#!/usr/bin/env bash
#
# Packs the published package and proves that what comes out of npm pack
# actually delivers what its manifest advertises.
#
# Comparing a file list against a previous release cannot be the gate here,
# because 2.12.0 is itself the broken baseline: it ships none of the twelve
# subpath declaration files its own exports map advertises, so a tarball that
# matches it faithfully reproduces the defect. This is a behavioural check
# instead. It packs for real rather than with --dry-run, takes the archive path
# from npm's own JSON rather than reconstructing the filename, and installs that
# exact archive outside the workspace so that nothing resolves back to the source
# tree through the workspace symlink and quietly passes on files the tarball
# never contained.
#
# The archive is installed rather than inspected, because the point is what a
# consumer receives.

set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

echo "check-package-contract: packing the package"
npm pack --json --pack-destination "$work" \
  --workspace @speclynx/api-languageservice \
  > "$work/pack.json"

consumer="$work/consumer"
mkdir "$consumer"
cat > "$consumer/package.json" <<'JSON'
{
  "name": "package-contract-consumer",
  "version": "0.0.0",
  "private": true
}
JSON

archives=()
while IFS= read -r filename; do
  archives+=("$work/$filename")
done < <(node -e '
  const report = require(process.argv[1]);
  for (const entry of report) console.log(entry.filename);
' "$work/pack.json")

echo "check-package-contract: installing ${#archives[@]} archive(s) into a scratch consumer"
npm install --prefix "$consumer" --engine-strict=false --no-audit --no-fund "${archives[@]}"

cp scripts/package-contract-probe.mjs "$consumer/probe.mjs"
( cd "$consumer" && node probe.mjs "$work/pack.json" )

# The probe leaves behind a TypeScript source importing every advertised
# subpath. Type-checking it is what proves the `types` targets both exist and
# describe something tsc can read.
cat > "$consumer/tsconfig.json" <<'JSON'
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": []
  },
  "files": ["types-probe.ts"]
}
JSON

echo "check-package-contract: type-checking every advertised subpath"
"$root/node_modules/.bin/tsc" -p "$consumer/tsconfig.json"

# The checksums of the archives this run verified, rather than of a second pack
# produced afterwards: what was checked and what is recorded are the same bytes.
echo "check-package-contract: verified archives"
sha256sum "${archives[@]}" | sed "s|$work/||"
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  sha256sum "${archives[@]}" | sed "s|$work/||" >> "$GITHUB_STEP_SUMMARY"
fi

# The archives are packed into a temporary directory that goes away with this
# script, which is fine when the release publishes them itself. It is not fine
# when a human has to. The scope disallows bypass-2FA tokens, so the first
# publish of a name that does not exist yet cannot run on a credential at all,
# and the operator must publish the exact bytes CI built and these checks
# approved rather than rebuild anything locally. Set KEEP_ARCHIVES_IN and they
# survive the run.
if [ -n "${KEEP_ARCHIVES_IN:-}" ]; then
  mkdir -p "$KEEP_ARCHIVES_IN"
  cp "${archives[@]}" "$KEEP_ARCHIVES_IN/"
  sha256sum "${archives[@]}" | sed "s|$work/||" > "$KEEP_ARCHIVES_IN/SHA256SUMS"
  echo "check-package-contract: archives kept in $KEEP_ARCHIVES_IN"
fi

echo "check-package-contract: passed"
