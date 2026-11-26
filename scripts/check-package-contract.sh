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
# consumer receives. That includes the dependency tree: the install must not
# contain a component the dependency policy denies, and the notices must credit
# the code copied in from packages it no longer contains.

set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# Set PUBLISHED_VERSION and the check runs on the archive the registry serves
# for that version instead of a fresh pack. That is how a release checks what
# it published, which is not what npm pack makes here: Lerna writes the release
# commit into the manifest as gitHead before it packs.
if [ -n "${PUBLISHED_VERSION:-}" ]; then
  echo "check-package-contract: fetching version $PUBLISHED_VERSION from the registry"
  npm pack --json --pack-destination "$work" \
    "@speclynx/api-languageservice@$PUBLISHED_VERSION" \
    > "$work/pack.json"
else
  echo "check-package-contract: packing the package"
  npm pack --json --pack-destination "$work" \
    --workspace @speclynx/api-languageservice \
    > "$work/pack.json"
fi

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

# A published version is installed from the registry, which npm checks against
# the integrity of the archive fetched above, so that the consumer's tree, and
# the SBOM read from it, record where the archive is served.
if [ -n "${PUBLISHED_VERSION:-}" ]; then
  install_targets=("@speclynx/api-languageservice@$PUBLISHED_VERSION")
else
  install_targets=("${archives[@]}")
fi

echo "check-package-contract: installing ${#archives[@]} archive(s) into a scratch consumer"
npm install --prefix "$consumer" --engine-strict=false --no-audit --no-fund "${install_targets[@]}"

cp scripts/package-contract-probe.mjs "$consumer/probe.mjs"
( cd "$consumer" && node probe.mjs "$work/pack.json" )

# The probe leaves behind an ES module and a CommonJS module, each importing
# every advertised subpath. Type-checking them is what proves the `types`
# targets of both conditions exist and describe something tsc can read, in the
# module format the condition promises. Both resolution modes are checked:
# nodenext lets CommonJS import ESM declarations, so only node16 catches a
# require condition that hands out ESM ones. skipLibCheck is off, because tsc
# reports an error inside a declaration file only then: a .d.cts of this
# package that reaches an ESM declaration through its own imports passes with
# it on, and attw does not report that case either.
#
# With it off tsc also checks the declarations of every dependency, as the
# fresh install resolves them. An error there is reported as a warning rather
# than failing the check: nothing in this package causes it, and failing would
# block the nightly build and the check of a version already published. An
# error in this package's own declarations, in the probes, or in no file at all
# fails it.
for module in nodenext node16; do
  cat > "$consumer/tsconfig.$module.json" <<JSON
{
  "compilerOptions": {
    "target": "esnext",
    "module": "$module",
    "moduleResolution": "$module",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": false,
    "types": []
  },
  "files": ["types-probe.mts", "types-probe.cts"]
}
JSON

  echo "check-package-contract: type-checking every advertised subpath under $module"
  tsc_output="$work/tsc.$module.log"
  # run from the consumer, so tsc prints each file relative to it
  if ( cd "$consumer" && "$root/node_modules/.bin/tsc" -p "tsconfig.$module.json" --pretty false ) > "$tsc_output"; then
    continue
  fi
  # an error line begins with the file it is in; indented continuation lines
  # belong to the error before them
  errors="$(grep -vE '^[[:space:]]' "$tsc_output" || true)"
  # a dependency npm nests under this package's own directory is still a
  # dependency
  own='^node_modules/@speclynx/api-languageservice/'
  nested='^node_modules/@speclynx/api-languageservice/node_modules/'
  theirs="$(printf '%s\n' "$errors" | grep -E '^node_modules/' \
    | { grep -vE "$own" || true; } ; printf '%s\n' "$errors" | grep -E "$nested" || true)"
  ours="$(printf '%s\n' "$errors" | grep -vE '^node_modules/' | grep -vE '^$' || true)"
  ours+="$(printf '%s\n' "$errors" | grep -E "$own" | grep -vE "$nested" || true)"
  if [ -n "$theirs" ]; then
    echo "check-package-contract: warning: tsc reports errors in dependencies' declarations under $module:"
    printf '%s\n' "$theirs"
  fi
  if [ -n "$ours" ]; then
    echo "check-package-contract: tsc reports errors in this package's declarations or the probes under $module:"
    cat "$tsc_output"
    exit 1
  fi
done

# The CycloneDX SBOM a release attaches, read from this consumer because it
# lists what installing the package brings in at this moment, rather than what
# the workspace lockfile resolved. Set SBOM_TO to a file and it is written there.
if [ -n "${SBOM_TO:-}" ]; then
  ( cd "$consumer" && npm sbom --sbom-format cyclonedx ) > "$work/consumer-sbom.json"
  node scripts/complete-sbom.mjs "$work/consumer-sbom.json" "$consumer" "$work/pack.json" "$SBOM_TO"
fi

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
