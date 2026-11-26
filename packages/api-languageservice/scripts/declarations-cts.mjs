/**
 * Writes the .d.cts declarations the require condition of the exports map
 * names, for consumers that require() the package.
 *
 * In a "type": "module" package TypeScript reads a .d.ts as ESM declarations,
 * so the require condition needs its own CommonJS-flavored copy of what the
 * import condition names. Relative imports are rewritten from .ts to .cts, and
 * every .d.ts they reach is copied too, so the copies import each other rather
 * than falling back to the ESM ones. Imports of other packages by name are left
 * alone: each package's own require condition resolves them.
 *
 * The api-extractor rollup imports nothing relative, so its copy is verbatim.
 * The subpath entries point into tsc's per-file declaration tree, and only the
 * part of the tree they reach is copied, not the thousands of rule files.
 *
 * Run from the package directory, after tsc and api-extractor.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const RELATIVE_TS = /((?:from|import)\s*\(?\s*)(['"])(\.\.?\/[^'"]+)\.ts\2/g;

const fail = (message) => {
  console.error(`declarations-cts: ${message}`);
  process.exit(1);
};

const { exports: exportsMap } = JSON.parse(readFileSync('package.json', 'utf8'));
const pending = [];

for (const [subpath, target] of Object.entries(exportsMap)) {
  const esm = target.import?.types;
  const cjs = target.require?.types;
  if (!esm?.endsWith('.d.ts') || cjs !== esm.replace(/\.d\.ts$/, '.d.cts')) {
    fail(`${subpath} must name a .d.ts for import and the matching .d.cts for require`);
  }
  pending.push(path.resolve(esm));
}

const visited = new Set();

while (pending.length > 0) {
  const file = pending.pop();
  if (visited.has(file)) continue;
  visited.add(file);

  const source = readFileSync(file, 'utf8');
  const rewritten = source.replace(RELATIVE_TS, (match, prefix, quote, specifier) => {
    pending.push(path.resolve(path.dirname(file), `${specifier}.d.ts`));
    return `${prefix}${quote}${specifier}.cts${quote}`;
  });

  writeFileSync(file.replace(/\.d\.ts$/, '.d.cts'), rewritten);
}

console.log(`declarations-cts: wrote ${visited.size} CommonJS declaration file(s)`);
