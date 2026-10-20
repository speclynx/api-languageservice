import fs from 'node:fs';
import path from 'node:path';

/**
 * Turns the CycloneDX SBOM npm writes for the scratch consumer of
 * check-package-contract.sh into the SBOM of the package that consumer
 * installed. The package becomes the subject of the SBOM, and the code it
 * contains rather than depends on becomes components nested in it. The files
 * copied or ported into it from other packages, which config/vendored-code.json
 * lists, carry a pedigree naming the package and the version each came from,
 * with the licence and copyright of the file's SPDX header. The browser bundle
 * carries the packages it embeds, at the versions it was built with, which
 * need not be the ones the consumer resolved; they are read from the notices
 * shipped beside it.
 *
 * Usage: node scripts/complete-sbom.mjs <consumer SBOM> <consumer directory> <pack report> <SBOM to write>
 */
const packageDirectory = 'packages/api-languageservice';
const [consumerSbomPath, consumerDirectory, packReportPath, sbomPath] = process.argv.slice(2);

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sbom = readJson(consumerSbomPath);
const manifest = readJson(path.join(packageDirectory, 'package.json'));
const vendoredCode = readJson(path.join(packageDirectory, 'config', 'vendored-code.json'));
const installedDirectory = path.join(consumerDirectory, 'node_modules', manifest.name);
const installedManifest = readJson(path.join(installedDirectory, 'package.json'));
const archive = readJson(packReportPath).find((entry) => entry.name === manifest.name);

const packageComponent = sbom.components.find((component) => component.name === manifest.name);
if (packageComponent === undefined) {
  throw new Error(`${manifest.name} is not among the components of ${consumerSbomPath}`);
}
// the archive the contract check verified: a fresh pack on a pull request, the
// one the registry serves on a release
const archiveDigest = Buffer.from(archive.integrity.replace(/^sha512-/, ''), 'base64');
if (!packageComponent.hashes?.some(({ content }) => content === archiveDigest.toString('hex'))) {
  throw new Error(
    `the consumer did not install ${archive.filename}, the archive the contract check verified`,
  );
}
// the copied files are read from this checkout, so it has to be the release's
if (packageComponent.version !== manifest.version) {
  throw new Error(
    `the consumer installed ${manifest.name}@${packageComponent.version}, but this checkout ` +
      `is ${manifest.version}`,
  );
}
const consumerRef = sbom.metadata.component['bom-ref'];
sbom.metadata.component = packageComponent;
sbom.components = sbom.components.filter((component) => component !== packageComponent);
sbom.dependencies = sbom.dependencies.filter((dependency) => dependency.ref !== consumerRef);

const spdxValues = (source, tag) =>
  [...source.matchAll(new RegExp(`SPDX-${tag}: (.+)`, 'g'))].map(([, value]) => value.trim());

const purl = (name, version) => `pkg:npm/${name.replace(/^@/, '%40')}@${version}`;

// as npm writes them: a single licence by its identifier, anything else as an
// expression
const licensesOf = (license) =>
  /^[\w.+-]+$/.test(license) ? [{ license: { id: license } }] : [{ expression: license }];

const copiedFiles = vendoredCode.map(({ path: sourcePath, origin, notes }) => {
  // a copy has to be compared with the release it would now come from
  const pinnedVersion = manifest.devDependencies?.[origin.package];
  if (pinnedVersion !== origin.version) {
    throw new Error(
      `${sourcePath} comes from ${origin.package}@${origin.version}, but the devDependency ` +
        `is ${pinnedVersion}: compare the copy with that release, then update ` +
        'config/vendored-code.json and NOTICE',
    );
  }
  const source = fs.readFileSync(path.join(packageDirectory, sourcePath), 'utf8');
  const [license] = spdxValues(source, 'License-Identifier');
  const copyrights = spdxValues(source, 'FileCopyrightText');
  if (license === undefined || copyrights.length === 0) {
    throw new Error(`${sourcePath} has no SPDX licence and copyright header`);
  }
  // published as .mjs and .cjs
  const name = sourcePath.replace(/\.ts$/, '');
  return {
    type: 'file',
    'bom-ref': `${packageComponent['bom-ref']}#${name}`,
    name,
    version: packageComponent.version,
    copyright: copyrights.join('\n'),
    licenses: licensesOf(license),
    pedigree: {
      ancestors: [
        {
          type: 'library',
          name: origin.package,
          version: origin.version,
          purl: purl(origin.package, origin.version),
        },
      ],
      notes: `From ${origin.file} of ${origin.package}@${origin.version}. ${notes}`,
    },
  };
});

/**
 * The packages the browser bundle embeds, from the notices the build writes
 * beside it, where each one's heading reads "name@version — licence" between
 * two rules. The packages code was copied from are credited there as well, and
 * are left to the pedigree of the copied files: they are only devDependencies,
 * so the package cannot import them without failing the export checks in a
 * consumer, which does not install them.
 */
const bundlePath = path.posix.normalize(installedManifest.unpkg);
const noticesPath = path.join(
  installedDirectory,
  path.dirname(bundlePath),
  'THIRD-PARTY-NOTICES.txt',
);
const noticesLines = fs.readFileSync(noticesPath, 'utf8').split('\n');
const rule = '-'.repeat(78);
const headings = noticesLines.filter(
  (line, index) => noticesLines[index - 1] === rule && noticesLines[index + 1] === rule,
);
if (
  headings.length === 0 ||
  2 * headings.length !== noticesLines.filter((line) => line === rule).length
) {
  throw new Error(`${noticesPath} does not have the layout this script reads`);
}
const copiedOrigins = new Set(
  vendoredCode.map(({ origin }) => `${origin.package}@${origin.version}`),
);
const bundleRef = `${packageComponent['bom-ref']}#${bundlePath}`;
const bundledPackages = headings.flatMap((heading) => {
  const [, name, version, license] = /^(.+)@([^@]+) — (.+)$/.exec(heading) ?? [];
  if (name === undefined) throw new Error(`${noticesPath}: cannot read the heading ${heading}`);
  if (copiedOrigins.has(`${name}@${version}`)) return [];
  return [
    {
      type: 'library',
      'bom-ref': `${bundleRef}:${name}@${version}`,
      name,
      version,
      purl: purl(name, version),
      // what the notices say when the package declares no licence
      ...(license === 'see below' ? {} : { licenses: licensesOf(license) }),
    },
  ];
});

packageComponent.components = [
  ...copiedFiles,
  {
    type: 'file',
    'bom-ref': bundleRef,
    name: bundlePath,
    version: packageComponent.version,
    components: bundledPackages,
  },
];

fs.writeFileSync(sbomPath, `${JSON.stringify(sbom, null, 2)}\n`);
console.log(
  `complete-sbom: ${manifest.name}@${packageComponent.version} with ${sbom.components.length} ` +
    `dependencies, ${copiedFiles.length} copied files and ${bundledPackages.length} packages ` +
    `embedded in ${bundlePath}`,
);
