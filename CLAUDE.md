# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ApiDOM Internal is a TypeScript monorepo that currently provides a single `apidom-ls` package offering language service capabilities for API description languages (OpenAPI, AsyncAPI, JSON Schema, Arazzo, etc.) and serialization formats (JSON, YAML) using ApiDOM (https://github.com/speclynx/apidom) as its foundation.

## Build & Development Commands

**Prerequisites:** Node.js =24.10.0 (exact version, see `.nvmrc`), npm >=11.6.1

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
npm run build:es:quick  # Fast ES build (skips config)
npm run watch:es        # Watch mode for development
npm run test:quick      # Quick test with limited build
npm run typescript:declaration  # Generate type declarations via api-extractor
```

### Working with Individual Packages

All npm scripts propagate to packages via lerna. To work with a specific package:

```bash
# Run tests for a single package
cd packages/apidom-ls && npm test

# Build a single package
cd packages/apidom-ls && npm run build:es
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

### Service Architecture (`packages/apidom-ls/src/`)

The `services/` directory contains the core functionality, organized by LSP capability: `completion/`, `validation/`, `hover/`, `definition/`, `links/`, `formatting/`, `symbols/`, `semantic-tokens/`, `conversion/`, and `deref/`. Supporting directories include `config/` (build configuration) and `utils/` (shared utilities).

### Build Pipeline

Babel transpiles TypeScript to three output formats. Build artifacts are placed alongside source files in `src/` (not in a separate output directory):
- `*.mjs` - ES modules (Babel `es` preset)
- `*.cjs` - CommonJS modules (Babel `cjs` preset)
- `dist/` - UMD browser bundles (Webpack)
- `types/` - TypeScript declarations (api-extractor)

### Testing

Tests use Mocha (config in `packages/apidom-ls/.mocharc.json`). Tests must be built before running since Mocha runs the compiled `.mjs` output, not the TypeScript source. Always `npm run build` (or at least `npm run build:es`) before `npm test`.

### Version Management

Lerna manages versioning with the Angular conventional commits preset. Releases are automated via GitHub Actions on the `main` branch.


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
