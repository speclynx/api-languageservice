import fs from 'node:fs';
import path from 'node:path';

/**
 * Turns the CycloneDX SBOM npm writes for the scratch consumer of
 * check-package-contract.sh into the SBOM of the package that consumer
 * installed. The package becomes the subject of the SBOM, and the files copied
 * or ported into it from other packages, which config/vendored-code.json lists,
 * become components of the package whose pedigree names the package and the
 * version each came from. A file's licence and copyright are read from its
 * SPDX header.
 *
 * Usage: node scripts/complete-sbom.mjs <consumer SBOM> <SBOM to write>
 */
const packageDirectory = 'packages/api-languageservice';
const [consumerSbomPath, sbomPath] = process.argv.slice(2);

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sbom = readJson(consumerSbomPath);
const manifest = readJson(path.join(packageDirectory, 'package.json'));
const vendoredCode = readJson(path.join(packageDirectory, 'config', 'vendored-code.json'));

const packageComponent = sbom.components.find((component) => component.name === manifest.name);
if (packageComponent === undefined) {
  throw new Error(`${manifest.name} is not among the components of ${consumerSbomPath}`);
}
const consumerRef = sbom.metadata.component['bom-ref'];
sbom.metadata.component = packageComponent;
sbom.components = sbom.components.filter((component) => component !== packageComponent);
sbom.dependencies = sbom.dependencies.filter((dependency) => dependency.ref !== consumerRef);

const spdxValues = (source, tag) =>
  [...source.matchAll(new RegExp(`SPDX-${tag}: (.+)`, 'g'))].map(([, value]) => value.trim());

const purl = (name, version) => `pkg:npm/${name.replace(/^@/, '%40')}@${version}`;

packageComponent.components = vendoredCode.map(({ path: sourcePath, origin, notes }) => {
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
    licenses: [{ license: { id: license } }],
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

fs.writeFileSync(sbomPath, `${JSON.stringify(sbom, null, 2)}\n`);
console.log(
  `complete-sbom: ${manifest.name}@${packageComponent.version} with ${sbom.components.length} ` +
    `dependencies and ${packageComponent.components.length} copied files`,
);
