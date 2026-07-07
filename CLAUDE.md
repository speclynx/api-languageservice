# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ApiDOM Internal is a TypeScript monorepo that currently provides a single `apidom-ls` package offering language service capabilities for API description languages (OpenAPI, AsyncAPI, JSON Schema, Arazzo, Overlay, etc.) and serialization formats (JSON, YAML) using ApiDOM (https://github.com/speclynx/apidom) as its foundation.

## Build & Development Commands

**Prerequisites:** Node.js =26.3.1 (exact version, see `.nvmrc`), npm >=11.16.0

**Important:** Always run nvm before executing any node/npm/npx commands to ensure the correct Node.js version is used:
```bash
source ~/.nvm/nvm.sh && nvm use
```

```bash
# Install dependencies (required before any other operation)
npm i

# Build all packages (required before running tests)
npm run build

# Build only ES modules (faster for development)
npm run build:es

# Run all tests (must build first)
npm run test

# Lint all packages
npm run lint
npm run lint:fix

# Type checking
npm run typescript:check-types

# Clean build artifacts
npm run clean

# Additional useful commands
npm run build:cjs       # Build CommonJS only
npm run build:es:quick  # Fast ES build (skips src/config/ rule definitions)
npm run watch:es        # Watch mode for development
npm run test:quick      # Quick test with limited build
npm run test:only       # Re-run tests without rebuilding (uses already-compiled .mjs)
npm run typescript:declaration  # Generate type declarations via api-extractor
```

### Working with Individual Packages

All npm scripts propagate to packages via lerna. To work with a specific package:

```bash
# Run tests for a single package
cd packages/apidom-ls && npm test

# Build a single package
cd packages/apidom-ls && npm run build:es

# Run a specific test file (must build first)
cd packages/apidom-ls && npx mocha 'test/validate.mjs'

# Run tests matching a grep pattern
cd packages/apidom-ls && npx mocha --grep 'should validate'
```

**Environment variables:**
```bash
export CPU_CORES=8      # Parallelization for builds (defaults to 2)
export OBFUSCATE=true   # Enable JavaScript obfuscation in builds
```

## Architecture

### Packages

The monorepo contains 1 package: `@speclynx/apidom-ls`

The ApiDOM Language Service provides LSP-compliant APIs for API description language editing. It's usable via an LSP Server wrapper in any editor or IDE.

### Key Entry Points (`packages/apidom-ls/src/`)

- `apidom-language-service.ts` — factory function `getLanguageService()` that wires up all services
- `apidom-language-types.ts` — all public interfaces (`LanguageService`, `LinterMeta`, `Metadata`, `ValidationContext`, etc.)
- `index.ts` — public API re-exports
- `parser-factory.ts` — document parsing with auto-detection of namespace/format
- `document-cache.ts` — LRU cache for parsed ApiDOM trees

### Service Architecture

The `services/` directory contains the core functionality, organized by LSP capability: `completion/`, `validation/`, `hover/`, `definition/`, `links/`, `formatting/`, `symbols/`, `semantic-tokens/`, `conversion/`, and `deref/`. Supporting directories include `config/` (rule/metadata definitions per API spec namespace) and `utils/` (shared utilities).

### Build Pipeline

Babel transpiles TypeScript to three output formats. Build artifacts are placed alongside source files in `src/` (not in a separate output directory):
- `*.mjs` - ES modules (Babel `es` preset)
- `*.cjs` - CommonJS modules (Babel `cjs` preset)
- `dist/` - UMD browser bundles (Webpack)
- `types/` - TypeScript declarations (api-extractor)

`build:es:quick` skips `src/config/` which contains the bulk of the source (thousands of rule/completion/documentation definition files). Use it when working on service code, not rules.

### Testing

Tests use Mocha (config in `packages/apidom-ls/.mocharc.json`). Both source and test files must be transpiled before running since Mocha runs compiled `.mjs` output. The `npm test` script handles this: it runs `build:es` on src, then babel-transpiles `test/*.ts` to `test/*.mjs`, then runs mocha. Use `npm run test:only` (or `npx mocha` directly) to re-run without rebuilding when only test fixture changes are needed. Test files live in `packages/apidom-ls/test/` with fixtures in `test/fixtures/`.

### Version Management

Lerna manages versioning with the Angular conventional commits preset. Releases are automated via GitHub Actions on the `main` branch.


## Rules Engine

The validation service (`packages/apidom-ls/src/services/validation/validation-service.ts`) implements a declarative rules engine that evaluates `LinterMeta` rule definitions against the parsed ApiDOM element tree. Each rule specifies a `linterFunction` (looked up by name from the standard library in `linter-functions.ts` or from custom metadata), parameters, target element/field, applicable spec versions (`targetSpecs`), optional `conditions`, and the diagnostic to produce on failure. Rules also support `negate` to invert function results, `marker`/`markerTarget` to control diagnostic positioning, and `data.quickFix` for automated code actions.

Rules are organized under `packages/apidom-ls/src/config/` in a hierarchy of `{namespace}/{element}/lint/{field}--{check}.ts` files, aggregated through `lint/index.ts` and `meta.ts` files into the `Metadata.metadataMaps` structure keyed by namespace (`openapi`, `asyncapi`, `ads`, `arazzo`, `overlay`, `json-schema-2020-12`). A `'*'` key applies rules to all elements within a namespace. Custom rules can be added at runtime by extending `metadataMaps` for element-level rules, or by populating `metadata.rules[namespace].lint` with a `given` field for namespace-level rules using either semantic element names or JSONPath expressions (`givenFormat: 'JSONPATH'`). Custom linter functions are registered in `metadata.linterFunctions[namespace]`.

Standard linter functions in `linter-functions.ts` include field existence checks (`hasRequiredField`, `missingField`, `existFields`), type validation (`apilintType`, `apilintNumber`), pattern matching (`apilintValueRegex`, `apilintKeyRegex`), structural validation (`allowedFields`, `apilintElementOrClass`, `apilintNoDuplicateKeys`), casing enforcement (`apilintValueCasing`, `apilintKeyCasing` supporting camel/kebab/snake/pascal/flat/cobol/macro), and OpenAPI-specific validators for path templates and parameter validation.

For detailed documentation including the full `LinterMeta` field reference, all built-in functions, condition evaluation, custom rule examples, and testing patterns, see `docs/rules-engine.md`.

## Code Style

- TypeScript with strict mode
- ESLint (flat config) + Prettier: single quotes, trailing commas, 100 char print width, 2-space indent
- Conventional Commits enforced by commitlint (max header: 69 chars) with husky hooks
- Pre-commit hook runs lint-staged (ESLint on staged `.ts` files)
- Branch naming: `username/description` (e.g. `frantuma/functions-contextual-return`)

## Dependencies

Key libraries:

* ApiDOM ecosystem (https://github.com/speclynx/apidom) — core, namespaces, parsers, reference, traverse

## CI/CD

Five GitHub Actions workflows: `build.yml` (lint, types, test, build on PRs), `release.yml` (manual publish to npm via lerna), `nightly-build.yml` (daily at 04:30 UTC with obfuscation), `codeql.yml` (weekly security scan), and `dependabot-merge.yml` (auto-merge dependency updates).
