import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
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
 * The components a dependency policy scan flagged and the package stopped
 * depending on: Ajv, which needs the end-of-life require-from-string, and
 * components older than five years. A consumer's install must not contain any
 * of them again, whichever dependency would bring one back.
 */
const deniedDependencies = [
  'ajv',
  'require-from-string',
  '@stoplight/better-ajv-errors',
  'json-source-map',
  'leven',
  'jsonpointer',
  'process',
];

const checkDeniedDependencies = () => {
  // npm ls exits non-zero on tree problems such as an unmet optional peer, and
  // still prints the tree
  let tree;
  try {
    tree = execFileSync('npm', ['ls', '--all', '--json'], { encoding: 'utf8' });
  } catch (error) {
    tree = error.stdout;
  }

  const visit = (dependencies, trail) => {
    for (const [dependencyName, node] of Object.entries(dependencies ?? {})) {
      // a peer or optional dependency npm did not install
      if (node.missing || node.version === undefined) continue;
      const dependencyPath = [...trail, `${dependencyName}@${node.version}`];
      check(
        !deniedDependencies.includes(dependencyName),
        `the install contains ${dependencyName}, which the dependency policy denies: ${dependencyPath.join(' > ')}`,
      );
      visit(node.dependencies, dependencyPath);
    }
  };
  visit(JSON.parse(tree).dependencies, []);
};

/**
 * The packages whose code the package contains without depending on them:
 * Ajv generated the JSON Schema validators, its runtime helpers and
 * fast-deep-equal are copied beside them, and the error formatter is ported
 * from @stoplight/better-ajv-errors. The notices shipped with the package must
 * keep crediting them.
 */
const creditedOrigins = ['ajv', 'fast-deep-equal', '@stoplight/better-ajv-errors'];

const checkNotices = (name) => {
  const noticesLines = fs
    .readFileSync(path.join('node_modules', name, 'dist', 'THIRD-PARTY-NOTICES.txt'), 'utf8')
    .split('\n');

  for (const origin of creditedOrigins) {
    check(
      noticesLines.some((line) => line.startsWith(`${origin}@`)),
      `${name}: dist/THIRD-PARTY-NOTICES.txt does not credit ${origin}, whose code the package contains`,
    );
  }
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

const packages = ['@speclynx/api-languageservice'];

for (const entry of packReport) {
  checkTarball(entry);
}

for (const name of packages) {
  await checkExports(name);
}

checkBrowserGlobal('@speclynx/api-languageservice', 'apiLanguageService');

for (const name of packages) {
  checkNotices(name);
}

checkDeniedDependencies();

writeTypeProbe(packages);

if (failures.length > 0) {
  console.error('Package contract violations:');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `check-package-contract: ${packages.length} package(s), every advertised export resolves ` +
    'through import, require and tsc, every browser bundle defines its global, the notices ' +
    'credit the code copied in, and the install contains no denied dependency.',
);
