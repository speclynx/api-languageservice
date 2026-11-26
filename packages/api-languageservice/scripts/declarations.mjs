/**
 * Finishes the declarations the exports map names.
 * Run from the package directory, right after tsc and api-extractor: it reads
 * tsc's per-file tree, which it rewrites, so it does not run twice on one build.
 *
 * 1. Subpath entries share the rollup's declarations. The main entry's types
 *    are the api-extractor rollup, and each subpath's are a file in tsc's
 *    per-file tree. Left alone, the two declare the same classes separately,
 *    and TypeScript treats classes with private members declared twice as
 *    unrelated, so a provider from a subpath could not be used where the main
 *    entry's JsonSchemaValidationProvider is expected. Each subpath file is
 *    rewritten to re-export from the rollup everything the rollup exports, and
 *    to keep declaring only what it lacks (the AsyncAPI providers, which the
 *    main entry leaves out to keep their validators off its load path), with
 *    its relative imports pointed at the rollup too.
 *
 * 2. The require condition gets .d.cts copies. In a "type": "module" package
 *    TypeScript reads a .d.ts as ESM declarations, so CommonJS consumers need
 *    their own. Relative imports are rewritten from .ts to .cts, and every file
 *    they reach is copied too, so the copies import each other. Imports of
 *    other packages by name are left alone: each package's own require
 *    condition resolves them.
 *
 * Module specifiers are read with TypeScript's own scanner, not a regex, so
 * import examples inside comments are ignored. Anything the copies cannot
 * represent fails the build rather than leaving a .d.cts that reaches an ESM
 * declaration.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const fail = (message) => {
  console.error(`declarations: ${message}`);
  process.exit(1);
};

const relative = (from, to) => {
  const specifier = path.relative(path.dirname(from), to).split(path.sep).join('/');
  return specifier.startsWith('.') ? specifier : `./${specifier}`;
};

const { exports: exportsMap } = JSON.parse(readFileSync('package.json', 'utf8'));

// entries that declare types: an object with import.types, and require.types
// naming the matching .d.cts; anything else (a plain string such as
// "./package.json", a null that blocks a subpath, or an entry without types)
// is not a declaration entry
const entries = [];
for (const [subpath, target] of Object.entries(exportsMap)) {
  const conditions = target !== null && typeof target === 'object' ? target : {};
  const esm = conditions.import?.types;
  const cjs = conditions.require?.types;
  if (esm === undefined && cjs === undefined) continue;
  if (!esm?.endsWith('.d.ts') || cjs !== esm.replace(/\.d\.ts$/, '.d.cts')) {
    fail(`${subpath} must name a .d.ts for import and the matching .d.cts for require`);
  }
  entries.push({ subpath, file: path.resolve(esm) });
}

const rollupEntry = entries.find(({ subpath }) => subpath === '.');
if (rollupEntry === undefined) fail('the exports map has no "." entry with types');
const rollup = rollupEntry.file;

// --- 1. subpath entries share the rollup's declarations ---------------------

const subpaths = entries.filter(({ subpath }) => subpath !== '.');

// tsc's declaration of the main entry, which api-extractor rolled up: a name a
// subpath shares with the rollup must resolve to the same declaration here,
// or the subpath would be handed an unrelated declaration that only shares
// its name
const mainSource = path.resolve('types/index.d.ts');
if (!existsSync(mainSource)) fail(`${mainSource} is missing; run tsc first`);

const compilerOptions = {
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  allowImportingTsExtensions: true,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
};
const program = ts.createProgram(
  [rollup, mainSource, ...subpaths.map(({ file }) => file)],
  compilerOptions,
);
const rewritten = new Map();
const checker = program.getTypeChecker();

const moduleExports = (file) => {
  const sourceFile = program.getSourceFile(file);
  const symbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
  if (symbol === undefined) fail(`${file} could not be read as a module`);
  return new Map(checker.getExportsOfModule(symbol).map((exported) => [exported.name, exported]));
};

// the declaration an export finally names, through any re-exports
const origin = (symbol) => {
  let resolved = symbol;
  while (resolved.flags & ts.SymbolFlags.Alias) resolved = checker.getAliasedSymbol(resolved);
  const [declaration] = resolved.declarations ?? [];
  return declaration && `${declaration.getSourceFile().fileName}:${declaration.pos}`;
};
const sameOrigin = (a, b) => {
  const left = origin(a);
  return left !== undefined && left === origin(b);
};

const inRollup = new Set(moduleExports(rollup).keys());
const mainExports = moduleExports(mainSource);
const isRelative = (specifier) => specifier.startsWith('./') || specifier.startsWith('../');
const isExported = (statement) =>
  ts.canHaveModifiers(statement) &&
  (ts.getModifiers(statement) ?? []).some(({ kind }) => kind === ts.SyntaxKind.ExportKeyword);
const declaredNames = (statement) =>
  ts.isVariableStatement(statement)
    ? statement.declarationList.declarations.map(({ name }) => name.getText())
    : [statement.name?.text].filter(Boolean);

// names a file re-exports only as types: `export type { X } from` or
// `export { type X } from`; re-exporting them as values would claim a runtime
// export the module does not have
const typeOnlyReexports = (sourceFile) => {
  const names = new Set();
  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.exportClause) continue;
    if (!ts.isNamedExports(statement.exportClause)) continue;
    for (const element of statement.exportClause.elements) {
      if (statement.isTypeOnly || element.isTypeOnly) names.add(element.name.text);
    }
  }
  return names;
};

for (const { subpath, file } of subpaths) {
  const sourceFile = program.getSourceFile(file);
  const subpathExports = moduleExports(file);
  const names = [...subpathExports.keys()];
  const typeOnly = typeOnlyReexports(sourceFile);
  const shared = names.filter((name) => inRollup.has(name));
  const own = new Set(names.filter((name) => !inRollup.has(name)));
  const rollupSpecifier = `${relative(file, rollup).replace(/\.d\.ts$/, '')}.ts`;

  for (const name of shared) {
    const main = mainExports.get(name);
    if (main === undefined || !sameOrigin(main, subpathExports.get(name))) {
      fail(`${subpath}: ${name} is not the declaration the main entry exports under that name`);
    }
  }

  const imports = [];
  const declarations = [];
  const found = new Set();
  // statements that are not exports, and shared names declared in this file:
  // both matter only if a declaration is kept here
  const helpers = [];
  const sharedHere = new Set();

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      imports.push(statement);
      continue;
    }

    if (ts.isExportDeclaration(statement)) {
      if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
        fail(`${subpath}: export * cannot be mapped onto the rollup; name what it re-exports`);
      }
      // named re-exports are covered by the rollup re-export below, as long
      // as the rollup has every name they export
      const leftOut = statement.exportClause.elements
        .map(({ name }) => name.text)
        .filter((name) => own.has(name));
      if (leftOut.length > 0) {
        fail(`${subpath}: re-exports ${leftOut.join(', ')}, which the rollup does not export`);
      }
      continue;
    }

    const declared = declaredNames(statement);
    if (!isExported(statement) || declared.length === 0) {
      helpers.push(statement.getText(sourceFile).slice(0, 60));
      continue;
    }
    const kept = declared.filter((name) => own.has(name));
    if (kept.length === 0) {
      // declared here and shared: the rollup re-export covers it, and a kept
      // declaration that uses it imports it from the rollup
      for (const name of declared) sharedHere.add(name);
      continue;
    }
    if (kept.length !== declared.length) {
      fail(`${subpath}: ${declared.join(', ')} mixes names the rollup has with names it lacks`);
    }

    const text = statement.getFullText(sourceFile).trim();
    // an inline import("./x.ts") type would still point into tsc's tree
    if (
      ts.preProcessFile(text, true, true).importedFiles.some(({ fileName }) => isRelative(fileName))
    ) {
      fail(
        `${subpath}: ${kept.join(', ')} uses an inline relative import() type, which cannot be redirected`,
      );
    }
    // every statement is kept, so overloads and merged declarations stay whole
    declarations.push(text);
    for (const name of kept) found.add(name);
  }

  const missing = [...own].filter((name) => !found.has(name));
  if (missing.length > 0) {
    fail(`${subpath}: could not find the declarations of ${missing.join(', ')}`);
  }
  // a kept declaration may use a local helper, which cannot be carried over;
  // a subpath that only re-exports drops its helpers with everything else
  if (declarations.length > 0 && helpers.length > 0) {
    fail(`${subpath}: a statement that is not an export cannot be kept: ${helpers[0]}`);
  }

  // imports matter only to the declarations kept here; a subpath that only
  // re-exports from the rollup drops them
  const keptImports =
    declarations.length === 0
      ? []
      : imports.map((statement) => {
          const specifier = statement.moduleSpecifier.text;
          if (!isRelative(specifier)) return statement.getText(sourceFile);
          // a relative import now comes from the rollup, so every name it binds
          // must be one the rollup exports
          const bindings = statement.importClause?.namedBindings;
          if (statement.importClause?.name || !bindings || !ts.isNamedImports(bindings)) {
            fail(`${subpath}: only named relative imports can be redirected to the rollup`);
          }
          for (const element of bindings.elements) {
            const imported = (element.propertyName ?? element.name).text;
            if (!inRollup.has(imported)) {
              fail(
                `${subpath}: ${imported}, imported from ${specifier}, is not exported by the rollup`,
              );
            }
          }
          const text = statement.getText(sourceFile);
          const quote = text.includes(`'${specifier}'`) ? "'" : '"';
          return text.replace(`${quote}${specifier}${quote}`, `'${rollupSpecifier}'`);
        });

  const sharedValues = shared.filter((name) => !typeOnly.has(name));
  const sharedTypes = shared.filter((name) => typeOnly.has(name));
  const lines = ['// Generated by scripts/declarations.mjs; re-exports the rollup.'];
  if (declarations.length > 0) {
    if (sharedHere.size > 0) {
      keptImports.push(`import { ${[...sharedHere].join(', ')} } from '${rollupSpecifier}';`);
    }
    lines.push(...keptImports, '', ...declarations, '');
  }
  if (sharedValues.length > 0) {
    lines.push(`export { ${sharedValues.join(', ')} } from '${rollupSpecifier}';`);
  }
  if (sharedTypes.length > 0) {
    lines.push(`export type { ${sharedTypes.join(', ')} } from '${rollupSpecifier}';`);
  }
  rewritten.set(file, `${lines.join('\n')}\n`);
}

// the rewritten files are type-checked before they are written: a kept
// declaration that names something the rewrite left out fails here, rather
// than in a consumer's build
const host = ts.createCompilerHost(compilerOptions);
const readFile = host.readFile.bind(host);
host.readFile = (fileName) => rewritten.get(path.resolve(fileName)) ?? readFile(fileName);
const getSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (fileName, languageVersion, ...rest) => {
  const text = rewritten.get(path.resolve(fileName));
  return text === undefined
    ? getSourceFile(fileName, languageVersion, ...rest)
    : ts.createSourceFile(fileName, text, languageVersion, true);
};
// skipLibCheck off: with it on, tsc checks no .d.ts file at all
const rewrittenProgram = ts.createProgram(
  [...rewritten.keys()],
  { ...compilerOptions, skipLibCheck: false },
  host,
);
for (const [file] of rewritten) {
  const sourceFile = rewrittenProgram.getSourceFile(file);
  const diagnostics = [
    ...rewrittenProgram.getSyntacticDiagnostics(sourceFile),
    ...rewrittenProgram.getSemanticDiagnostics(sourceFile),
  ];
  if (diagnostics.length > 0) {
    const message = ts.flattenDiagnosticMessageText(diagnostics[0].messageText, ' ');
    fail(
      `${path.relative(process.cwd(), file)}: the rewritten declarations do not type-check: ${message}`,
    );
  }
}
for (const [file, text] of rewritten) writeFileSync(file, text);

// --- 2. the require condition gets .d.cts copies ----------------------------

const pending = entries.map(({ file }) => file);
const visited = new Set();

while (pending.length > 0) {
  const file = pending.pop();
  if (visited.has(file)) continue;
  visited.add(file);

  const source = readFileSync(file, 'utf8');
  const { importedFiles, referencedFiles } = ts.preProcessFile(source, true, true);

  for (const reference of referencedFiles) {
    fail(`${file}: /// <reference path="${reference.fileName}"> cannot be mapped to a .d.cts`);
  }

  // rewrite from the end, so earlier positions stay valid; pos is the
  // specifier's opening quote
  let rewritten = source;
  for (const { fileName, pos } of [...importedFiles].sort((a, b) => b.pos - a.pos)) {
    if (!isRelative(fileName)) continue;
    if (!fileName.endsWith('.ts') || fileName.endsWith('.d.ts')) {
      fail(`${file}: the relative import "${fileName}" would reach ESM declarations from a .d.cts`);
    }
    const target = path.resolve(path.dirname(file), fileName.replace(/\.ts$/, '.d.ts'));
    if (!existsSync(target)) fail(`${file}: the relative import "${fileName}" resolves to nothing`);
    pending.push(target);

    const start = pos + 1;
    const end = start + fileName.length;
    rewritten = `${rewritten.slice(0, start)}${fileName.replace(/\.ts$/, '.cts')}${rewritten.slice(end)}`;
  }

  writeFileSync(file.replace(/\.d\.ts$/, '.d.cts'), rewritten);
}

console.log(
  `declarations: ${subpaths.length} subpath entries share the rollup, ` +
    `${visited.size} CommonJS declaration file(s) written`,
);
