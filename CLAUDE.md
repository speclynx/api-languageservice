# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ApiDOM Internal is a TypeScript monorepo that currently provides a single `apidom-ls` package offering language service capabilitier for API description languages (OpenAPI, AsyncAPI, JSON Schema, Arazzo, etc.) and serialization formats (JSON, YAML) using ApiDOM (https://github.com/speclynx/apidom) as its foundation.

## Build & Development Commands

**Prerequisites:** Node.js >=24.10.0, npm >=11.6.1

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
```

### Working with Individual Packages

All npm scripts propagate to packages via lerna. To work with a specific package:

```bash
# Run tests for a single package
cd packages/apidom-ls && npm test

# Build a single package
cd packages/apidom-ls && npm run build:es
```

**Performance tip:** Set `CPU_CORES` environment variable to match your CPU cores for faster parallel builds:
```bash
export CPU_CORES=8
npm run build
```

## Architecture

### Packages

The monorepo contains 1 package `apidom-ls`

The ApiDOM Language Service (apidom-ls) contains the language smarts powering ApiDOM supported languages processing, specifically editing experience.

ApiDOM Language Service APIs adhere to [LSP Protocol](https://microsoft.github.io/language-server-protocol/) and are therefore usable via a LSP Server wrapper in a variety of editors and IDEs.


### Build Outputs

Each package produces:
- `*.mjs` - ES modules (in `src/`)
- `*.cjs` - CommonJS modules (in `src/`)
- `dist/` - UMD bundles for browsers
- `types/` - TypeScript declarations


## Code Style

- TypeScript with strict mode
- ESLint + Prettier for formatting
- Conventional Commits for commit messages
- Branch naming: `feature/description` or `fix/issue-number-description`

## Dependencies

Key libraries:

* ApiDOM (https://github.com/speclynx/apidom)
