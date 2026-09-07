import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

/**
 * Runs from inside the scratch consumer, which is where it has to run: an ESM
 * specifier resolves against the importing module's own URL, so a probe living
 * in the repository would resolve every subpath through the workspace symlink
 * and pass on files the tarball never contained.
 *
 * Everything it asserts is read from the installed package or from the archive
 * npm actually produced. Enumerating the exports from the manifest inside the
 * installed package rather than from the workspace is the property that makes
 * this able to fail at all.
 */
const require = createRequire(import.meta.url);
const [packReportPath] = process.argv.slice(2);
const packReport = JSON.parse(fs.readFileSync(packReportPath, 'utf8'));
const failures = [];

const check = (condition, message) => {
  if (!condition) failures.push(message);
};

/**
 * The manifest fields a provenance-attested publish depends on, and the files a
 * redistribution has to carry. Asserted against the archive rather than the
 * working tree, because that is what npm uploads.
 */
const checkTarball = (entry) => {
  const { name, filename } = entry;
  const packed = new Set(entry.files.map((file) => file.path));
  const manifest = JSON.parse(
    fs.readFileSync(path.join('node_modules', name, 'package.json'), 'utf8'),
  );

  check(
    manifest.publishConfig?.provenance === true,
    `${name}: publishConfig.provenance is not true, so the release cannot attest provenance`,
  );
  check(
    manifest.publishConfig?.access === 'public',
    `${name}: publishConfig.access is not "public"`,
  );
  check(
    manifest.publishConfig?.registry === 'https://registry.npmjs.org',
    `${name}: publishConfig.registry is not the public npm registry`,
  );
  check(
    manifest.repository?.url === 'git+https://github.com/speclynx/api-languageservice.git',
    `${name}: repository.url does not name the published repository, which provenance requires`,
  );
  check(
    manifest.bugs?.url === 'https://github.com/speclynx/api-languageservice/issues',
    `${name}: bugs.url does not name a tracker anyone can file against`,
  );

  for (const required of [
    'package.json',
    'README.md',
    'NOTICE',
    'LICENSES/Apache-2.0.txt',
    'dist/THIRD-PARTY-NOTICES.txt',
  ]) {
    check(packed.has(required), `${name}: ${required} is missing from ${filename}`);
  }

  // The UMD bundle a CDN consumer follows, and every declaration the exports
  // map advertises. Both were advertised and neither was packaged before.
  const unpkg = manifest.unpkg.replace(/^\.\//, '');
  check(packed.has(unpkg), `${name}: the unpkg target ${unpkg} is missing from ${filename}`);

  for (const [subpath, target] of Object.entries(manifest.exports)) {
    for (const condition of ['types', 'import', 'require']) {
      const file = target[condition].replace(/^\.\//, '');
      check(
        packed.has(file),
        `${name}: ${subpath} resolves ${condition} to ${file}, which is missing from ${filename}`,
      );
    }
  }
};

/**
 * Every advertised entry point, resolved as both an ES module and a CommonJS
 * module from the installed package.
 */
const checkExports = async (name) => {
  const manifest = JSON.parse(
    fs.readFileSync(path.join('node_modules', name, 'package.json'), 'utf8'),
  );

  for (const subpath of Object.keys(manifest.exports)) {
    const specifier = subpath === '.' ? name : `${name}${subpath.slice(1)}`;

    try {
      const module = await import(specifier);
      check(
        Object.keys(module).length > 0,
        `${name}: import("${specifier}") resolved but exported nothing`,
      );
    } catch (error) {
      failures.push(`${name}: import("${specifier}") failed — ${error.message}`);
    }

    try {
      const module = require(specifier);
      check(
        Object.keys(module).length > 0,
        `${name}: require("${specifier}") resolved but exported nothing`,
      );
    } catch (error) {
      failures.push(`${name}: require("${specifier}") failed — ${error.message}`);
    }
  }
};

/**
 * The UMD bundle, evaluated the way a browser evaluates it: no module system in
 * scope, so the factory falls through to assigning the library to the global.
 * Nothing an import can reach exercises this, and it is the one part of the old
 * package's surface a dependency cannot reproduce for its dependent.
 */
const checkBrowserGlobal = (name, globalName) => {
  const manifest = JSON.parse(
    fs.readFileSync(path.join('node_modules', name, 'package.json'), 'utf8'),
  );
  const bundle = path.join('node_modules', name, manifest.unpkg.replace(/^\.\//, ''));

  // No module system in scope, so the UMD wrapper falls through to the global.
  // webpack reads that global from `self` by default, and its runtime reads the
  // script's own URL from `location.href` to resolve chunk paths — one chunk
  // here, but the read happens all the same.
  const context = vm.createContext({ location: { href: 'https://unpkg.test/bundle.js' } });
  vm.runInContext('var self = this; var window = this;', context);

  try {
    vm.runInContext(fs.readFileSync(bundle, 'utf8'), context, { filename: bundle });
  } catch (error) {
    failures.push(`${name}: evaluating ${manifest.unpkg} as a browser would failed — ${error.message}`);
    return;
  }

  const exported = vm.runInContext(`typeof ${globalName} === 'undefined' ? null : ${globalName}`, context);
  check(
    exported !== null && typeof exported === 'object',
    `${name}: ${manifest.unpkg} did not define the ${globalName} global`,
  );
  check(
    exported !== null && typeof exported.getLanguageService === 'function',
    `${name}: the ${globalName} global does not expose getLanguageService`,
  );
};

/**
 * A TypeScript source importing every advertised subpath, for tsc to resolve
 * and check against the declarations in the installed packages.
 */
const writeTypeProbe = (names) => {
  const lines = ['// Generated by scripts/package-contract-probe.mjs.'];
  let counter = 0;

  for (const name of names) {
    const manifest = JSON.parse(
      fs.readFileSync(path.join('node_modules', name, 'package.json'), 'utf8'),
    );
    for (const subpath of Object.keys(manifest.exports)) {
      const specifier = subpath === '.' ? name : `${name}${subpath.slice(1)}`;
      counter += 1;
      lines.push(`import * as probe${counter} from '${specifier}';`);
      lines.push(`void probe${counter};`);
    }
  }

  fs.writeFileSync('types-probe.ts', `${lines.join('\n')}\n`);
};

const packages = ['@speclynx/api-languageservice', '@speclynx/apidom-ls'];

for (const entry of packReport) {
  checkTarball(entry);
}

for (const name of packages) {
  await checkExports(name);
}

checkBrowserGlobal('@speclynx/api-languageservice', 'apiLanguageService');
checkBrowserGlobal('@speclynx/apidom-ls', 'apidomLs');

writeTypeProbe(packages);

if (failures.length > 0) {
  console.error('Package contract violations:');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `check-package-contract: ${packages.length} packages, every advertised export resolves ` +
    'through import, require and tsc, and both browser bundles define their global.',
);
