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
// the names each entry point exports at runtime, by format, for the type probe
const runtimeKeys = { import: new Map(), require: new Map() };
// the validation provider classes each entry point exports, by format: every
// export whose prototype extends the main entry's JsonSchemaValidationProvider
const providerClasses = { import: new Map(), require: new Map() };
const recordProviders = (format, specifier, module, main) => {
  const base = main?.JsonSchemaValidationProvider;
  if (typeof base !== 'function') return;
  providerClasses[format].set(
    specifier,
    Object.keys(module).filter(
      (key) => typeof module[key] === 'function' && module[key].prototype instanceof base,
    ),
  );
};

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

  // Each entry point nests its own types under import and require, because
  // TypeScript reads a .d.ts in a "type": "module" package as ESM and a
  // CommonJS consumer needs the .d.cts. A condition missing here would leave
  // that consumer resolving the other one's declarations.
  for (const [subpath, target] of Object.entries(manifest.exports)) {
    // null blocks a subpath, and a plain string target may only name a data
    // file such as "./package.json": a code entry point needs import and
    // require conditions with their own types
    if (target === null) continue;
    if (typeof target === 'string') {
      const file = target.replace(/^\.\//, '');
      check(
        file.endsWith('.json'),
        `${name}: ${subpath} names ${file} directly, so it has no types and no CommonJS condition`,
      );
      check(
        packed.has(file),
        `${name}: ${subpath} resolves to ${file}, which is missing from ${filename}`,
      );
      continue;
    }
    for (const condition of ['import', 'require']) {
      for (const field of ['types', 'default']) {
        const advertised = target[condition]?.[field];
        if (advertised === undefined) {
          failures.push(`${name}: ${subpath} advertises no ${condition}.${field}`);
          continue;
        }
        const file = advertised.replace(/^\.\//, '');
        check(
          packed.has(file),
          `${name}: ${subpath} resolves ${condition}.${field} to ${file}, which is missing from ${filename}`,
        );
      }
    }
  }
};

/**
 * The entry points that are modules: every exports entry with conditions. A
 * plain string target, such as "./package.json", names a file, not code, and
 * a null target blocks a subpath.
 */
const codeEntryPoints = (manifest) =>
  Object.entries(manifest.exports)
    .filter(([, target]) => target !== null && typeof target === 'object')
    .map(([subpath]) => subpath);

/**
 * Every advertised entry point, resolved as both an ES module and a CommonJS
 * module from the installed package.
 */
const checkExports = async (name) => {
  const manifest = JSON.parse(
    fs.readFileSync(path.join('node_modules', name, 'package.json'), 'utf8'),
  );

  for (const subpath of codeEntryPoints(manifest)) {
    const specifier = subpath === '.' ? name : `${name}${subpath.slice(1)}`;

    try {
      const module = await import(specifier);
      runtimeKeys.import.set(specifier, Object.keys(module));
      recordProviders('import', specifier, module, await import(name));
      check(
        Object.keys(module).length > 0,
        `${name}: import("${specifier}") resolved but exported nothing`,
      );
    } catch (error) {
      failures.push(`${name}: import("${specifier}") failed — ${error.message}`);
    }

    try {
      const module = require(specifier);
      runtimeKeys.require.set(specifier, Object.keys(module));
      recordProviders('require', specifier, module, require(name));
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
 * depending on: Ajv, which needs the end-of-life require-from-string,
 * components older than five years, and the Ramda types, which consumers never
 * needed. A consumer's install must not contain any of them again, whichever
 * dependency would bring one back.
 */
const deniedDependencies = [
  'ajv',
  'require-from-string',
  '@stoplight/better-ajv-errors',
  'json-source-map',
  'leven',
  'jsonpointer',
  'process',
  '@types/ramda',
  'types-ramda',
  'ts-toolbelt',
];

const checkDeniedDependencies = (names) => {
  // npm ls exits non-zero on problems in the tree, such as an invalid version,
  // and still prints the tree. --long adds the name from each package's own
  // manifest, which differs from the name it is installed under when a
  // dependency is an npm alias. Without a current hidden lockfile npm prints
  // every manifest whole, which can exceed the default buffer of 1 MB.
  let listing;
  try {
    listing = execFileSync('npm', ['ls', '--all', '--long', '--json'], {
      encoding: 'utf8',
      maxBuffer: Infinity,
    });
  } catch (error) {
    listing = error.stdout;
  }
  const tree = JSON.parse(listing);

  // an error that keeps npm from reading the tree prints no tree, which would
  // otherwise pass as one without denied dependencies
  const unlisted = names.filter((name) => tree.dependencies?.[name] === undefined);
  check(
    unlisted.length === 0,
    `npm ls does not list ${unlisted.join(', ')}, so the dependency policy could not be checked: ${tree.error?.summary ?? 'npm reported no error'}`,
  );

  const visit = (dependencies, trail) => {
    for (const [dependencyName, node] of Object.entries(dependencies ?? {})) {
      // a peer or optional dependency npm did not install
      if (node.missing || node.version === undefined) continue;
      const installed = `${node.name}@${node.version}`;
      const dependencyPath = [
        ...trail,
        dependencyName === node.name ? installed : `${dependencyName}@npm:${installed}`,
      ];
      check(
        !deniedDependencies.includes(node.name),
        `the install contains ${node.name}, which the dependency policy denies: ${dependencyPath.join(' > ')}`,
      );
      visit(node.dependencies, dependencyPath);
    }
  };
  visit(tree.dependencies, []);
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
 * TypeScript sources importing every advertised subpath, for tsc to resolve
 * and check against the declarations in the installed packages. The file
 * extension fixes the module format whatever the consumer's package.json says:
 * types-probe.mts is an ES module and resolves the import condition, and
 * types-probe.cts is a CommonJS module, whose imports compile to require() and
 * resolve the require condition. The second fails when the require condition
 * hands a CommonJS consumer ESM declarations. Each also checks that the
 * values its declarations export exist at runtime in that format, and that a
 * subpath shares the main entry's classes.
 */
const writeTypeProbe = (names) => {
  // types-probe.mts resolves the import condition and types-probe.cts the
  // require one, so each compares its declarations with what that format
  // exports at runtime
  for (const [file, format] of [
    ['types-probe.mts', 'import'],
    ['types-probe.cts', 'require'],
  ]) {
    const lines = ['// Generated by scripts/package-contract-probe.mjs.'];
    let counter = 0;

    for (const name of names) {
      const manifest = JSON.parse(
        fs.readFileSync(path.join('node_modules', name, 'package.json'), 'utf8'),
      );
      let main;
      const others = [];
      for (const subpath of codeEntryPoints(manifest)) {
        const specifier = subpath === '.' ? name : `${name}${subpath.slice(1)}`;
        counter += 1;
        lines.push(`import * as probe${counter} from '${specifier}';`);
        lines.push(`void probe${counter};`);
        // every value the declarations export must exist at runtime: a class
        // or enum exported with export type type-checks and then is undefined
        const runtime = JSON.stringify(runtimeKeys[format].get(specifier) ?? []);
        lines.push(`declare const runtimeNames${counter}: readonly ${runtime};`);
        lines.push(
          `type Missing${counter} = Exclude<keyof typeof probe${counter}, ` +
            `(typeof runtimeNames${counter})[number]>;`,
        );
        lines.push(
          `export const runtime${counter}: [Missing${counter}] extends [never] ` +
            `? true : Missing${counter} = true;`,
        );
        if (subpath === '.') main = counter;
        else others.push({ index: counter, specifier });
      }
      // A class a subpath shares with the main entry must be the same
      // declaration: TypeScript treats a class with private members declared
      // twice as two unrelated classes, so a subpath's provider would not be
      // usable where the main entry's type is expected. Only the value
      // exports the two declare in common are compared; Partial<> would trip
      // TypeScript's weak-type check for a subpath that shares none. A
      // provider a subpath declares itself, which the main entry lacks, must
      // still be usable as the main entry's JsonSchemaValidationProvider.
      if (main !== undefined) {
        for (const { index, specifier } of others) {
          const shared = `Extract<keyof typeof probe${index}, keyof typeof probe${main}>`;
          lines.push(
            `export const shared${index}: Pick<typeof probe${main}, ${shared}> = probe${index};`,
          );
          for (const provider of providerClasses[format].get(specifier) ?? []) {
            lines.push(
              `export const provider${index}${provider}: ` +
                // the instance type; the base's constructor is protected, so
                // InstanceType<> does not accept it
                `(typeof probe${main}.JsonSchemaValidationProvider)['prototype'] = ` +
                `new probe${index}.${provider}();`,
            );
          }
        }
      }
    }

    fs.writeFileSync(file, `${lines.join('\n')}\n`);
  }
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

checkDeniedDependencies(packages);

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
