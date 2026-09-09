# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.13.0](https://github.com/speclynx/api-languageservice/compare/v2.12.0...v2.13.0) (2026-09-09)

**Note:** Version bump only for package @speclynx/api-languageservice

Entries up to and including 2.12.0 were made while this project was developed privately as
`speclynx/apidom-internal` under the package name `@speclynx/apidom-ls`. The `#NNN` issue and
pull request numbers and the commit SHAs they cite refer to that repository, which is not
public and whose commit SHAs did not survive the filtering that produced this history, so
they are given as plain identifiers rather than as links. Entries from 2.13.0 onward refer to
this repository and link normally.

# 2.12.0 (2026-08-31)

### Features

- **ls:** add Arazzo 1.1 validation rules (#201) (99c965e), closes #297

## 2.11.7 (2026-08-04)

### Bug Fixes

- **apidom-ls:** bump apidom to 5.0.2 for Arazzo $ref fix (#196) (e9671ca), closes #194
- **apidom-ls:** guard metadata.linterFunctions/metadataMaps lookups (#195) (e2e24d9), closes #191
- **arazzo:** skip param/action rules on Reusable Objects (#193) (071542f), closes #192

## 2.11.6 (2026-07-20)

### Bug Fixes

- remove JavaScript obfuscation from build (#181) (a1c9506)

## 2.11.5 (2026-07-07)

**Note:** Version bump only for package @speclynx/apidom-ls

## 2.11.4 (2026-05-20)

### Bug Fixes

- **apidom-ls:** enable hover docs and completion for Overlay 1.0 (#166) (8d6069e)

## 2.11.3 (2026-05-20)

### Bug Fixes

- **apidom-ls:** use correct JSON Schema for Overlay 1.0 validation (#165) (f334135)

## 2.11.2 (2026-05-20)

### Bug Fixes

- **docs:** claim Olverlay support in README (8864dbd)

## 2.11.1 (2026-05-13)

**Note:** Version bump only for package @speclynx/apidom-ls

# 2.11.0 (2026-04-22)

### Features

- **apidom-ls:** add completion rules for Overlay 1.1.0 (#160) (4810a34)
- **apidom-ls:** add documentation rules for Overlay 1.1.0 (#159) (95fd548)

# 2.10.0 (2026-04-20)

### Bug Fixes

- **apidom-ls:** scope Arazzo no-script-tags per field (#158) (06f57f0)

### Features

- **ls:** add semantic linting rules for Overlay 1.x (#157) (0cbe437)

# 2.9.0 (2026-04-16)

### Features

- **apidom-ls:** add Overlay 1.x parsing and JSON Schema validation (#156) (9cabb2b)

# 2.8.0 (2026-04-15)

### Bug Fixes

- **apidom-ls:** add JSONSchema202012 to apilintElementOrClass checks (82819ec)
- **apidom-ls:** fix JSON Schema rules for Arazzo (6842d9d)
- **apidom-ls:** fix SCHEMA_PATTERNPROPERTIES_KEY (dbb6111)
- **apidom-ls:** resolve api-extractor warnings (#155) (9c3e41e)
- **apidom-ls:** support MIME type params in regex (0e3e037)
- **apidom-ls:** validate sourceDescription refs (12d5181)
- **arazzo-rules:** improve script tag detection (b99ea3a)
- **build:** align obfuscation with vscode-openapi-toolkit (#153) (4329702)
- **deps:** bump [@speclynx](https://github.com/speclynx) deps to 4.7.0 and yaml to 2.8.3 (#152) (5e1fe69)
- fix code linting errors (c17aa69)

### Features

- **apidom-ls:** add Arazzo and JSON Schema rules (86bcbd6)
- **apidom-ls:** add Arazzo element rule tests (36769aa)
- **apidom-ls:** add Arazzo JSON Schema tests (0254d12)
- **apidom-ls:** add Arazzo linting rules (374b13b)
- **apidom-ls:** add Arazzo mutual exclusivity rules (6d5431f)
- **apidom-ls:** add Arazzo to JSON Schema rules (89ca722)
- **apidom-ls:** add missing Arazzo rules (01f4342)
- **apidom-ls:** add Phase 5 Batch 1 best-practice Arazzo lint rules (a85970f)
- **apidom-ls:** add Phase 5 Batch 2 uniqueness Arazzo lint rules (4c54eac)
- **apidom-ls:** add Phase 5 Batch 3 cross-ref rules (aa24d59)
- **apidom-ls:** add tests and documentation for Arazzo linting rules (1142dff)

# 2.7.0 (2026-03-22)

### Features

- **apidom-ls:** upgrade @speclynx/apidom-\* dependencies to v4.2.0 (126383e)

# 2.6.0 (2026-03-21)

### Bug Fixes

- **apidom-ls:** add [@public](https://github.com/public) JSDoc tags to exported type aliases (87f7a21)
- **apidom-ls:** add missing [@public](https://github.com/public) JSDoc tags to exported symbols (1239c2f)
- **apidom-ls:** harden root() and apilintSiblingUniqueCompositeValue (03350bc)
- **apidom-ls:** return defensive copy from getElementsByTypeOrClass (aa50b31)

### Features

- **apidom-ls:** integrate Arazzo namespace support in linter rules (0c7e1b2)

# 2.5.0 (2026-03-16)

### Bug Fixes

- **apidom-ls:** address PR #138 review comments (4823a47)
- **apidom-ls:** gate all per-phase profiling behind debug check (df76791)

### Features

- **apidom-ls:** add lint rule for "items" in array schemas (daa8c89)

### Performance Improvements

- **apidom-ls:** cache full-tree traversals in linter functions (765afdb)
- **apidom-ls:** fix O(n^2) uniqueness check, add profiling (4edd520)
- **apidom-ls:** optimize validation and linting performance (09a16f7)

## 2.4.3 (2026-03-12)

### Bug Fixes

- **release:** override minimatch 10.2.3 to fix glob pattern regression in lerna publish (#135) (221e330), closes [lerna/lerna#4305](https://github.com/lerna/lerna/issues/4305) [isaacs/minimatch#284](https://github.com/isaacs/minimatch/issues/284)

## 2.4.2 (2026-03-11)

**Note:** Version bump only for package @speclynx/apidom-ls

## 2.4.1 (2026-03-11)

**Note:** Version bump only for package @speclynx/apidom-ls

# 2.4.0 (2026-03-11)

### Features

- integrate with SpecLynx ApiDOM v4 (#134) (091c737)

# 2.3.0 (2026-03-09)

### Features

- adapt to SpecLynx ApiDOM v3.2.0 (#133) (c2ce3b1)

## 2.2.3 (2026-02-24)

### Bug Fixes

- **ls:** parse document larger than 32768 lines (#132) (4e70fb8)

## 2.2.2 (2026-02-12)

**Note:** Version bump only for package @speclynx/apidom-ls

## 2.2.1 (2026-02-11)

### Bug Fixes

- **ls:** remove console.log from validation service (0dfd771)

# 2.2.0 (2026-02-10)

### Features

- **ls:** add support for Arazzo 1.0.x JSON Schema validation (#124) (4c73469)

# 2.1.0 (2026-02-09)

### Features

- **ls:** add support for Arazzo 1.0.1 (#123) (2538753)

## 2.0.2 (2026-02-08)

### Bug Fixes

- **release:** disable provenance (a300c1a)

## 2.0.1 (2026-02-08)

**Note:** Version bump only for package @speclynx/apidom-ls

# [1.11.0](https://github.com/speclynx/apidom/compare/v1.10.0...v1.11.0) (2025-12-17)

### Bug Fixes

- **apidom-ls:** refs speclynx/vscode-openapi-toolkit/issues/14 - update common Schema documentation links ([914c5e1](https://github.com/speclynx/apidom/commit/914c5e1068cb652021ca074610785f82df14b0a8))

### Features

- **apidom-ls:** fix openapi version validation ([4afd2b7](https://github.com/speclynx/apidom/commit/4afd2b7faf4621251d69549ae250de37e60dea29))
- implement formatting and conversion service for YAML and JSON formats ([87b7482](https://github.com/speclynx/apidom/commit/87b7482a800bbca2b1f1a8f1c325f2488d859bb4))

# [1.10.0](https://github.com/speclynx/apidom/compare/v1.9.0...v1.10.0) (2025-12-13)

**Note:** Version bump only for package @speclynx/apidom-ls

# [1.9.0](https://github.com/speclynx/apidom/compare/v1.8.0...v1.9.0) (2025-09-28)

### Features

- **ls:** add OpenAPI 3.1.2 support in openapi config ([#90](https://github.com/speclynx/apidom/issues/90)) ([f5a7c84](https://github.com/speclynx/apidom/commit/f5a7c84a225255fc764086246b0fd0bef9c55962))

# [1.8.0](https://github.com/speclynx/apidom/compare/v1.7.1...v1.8.0) (2025-09-27)

### Features

- **ls:** add support for OpenAPI 3.1.2 ([#89](https://github.com/speclynx/apidom/issues/89)) ([23bde06](https://github.com/speclynx/apidom/commit/23bde061203f67dbe835e8dc5ab8e104d53cf572))

## [1.7.1](https://github.com/speclynx/apidom/compare/v1.7.0...v1.7.1) (2025-09-06)

**Note:** Version bump only for package @speclynx/apidom-ls

# [1.7.0](https://github.com/speclynx/apidom/compare/v1.6.0...v1.7.0) (2025-09-05)

### Features

- **ls:** add support for OpenAPI 3.1.1 completion ([#78](https://github.com/speclynx/apidom/issues/78)) ([11d4800](https://github.com/speclynx/apidom/commit/11d4800d3c53730e55b3c6205f28e4721c43da43)), closes [#75](https://github.com/speclynx/apidom/issues/75)

# [1.6.0](https://github.com/speclynx/apidom/compare/v1.5.0...v1.6.0) (2025-09-05)

### Features

- **ls:** expose target specs ([#77](https://github.com/speclynx/apidom/issues/77)) ([38f1c0a](https://github.com/speclynx/apidom/commit/38f1c0acfabb561d956e69ac1bc75b80e75a9e7c))

# [1.5.0](https://github.com/speclynx/apidom/compare/v1.4.2...v1.5.0) (2025-08-31)

### Features

- **ls:** add initial support for OpenAPI 3.1.1 ([#74](https://github.com/speclynx/apidom/issues/74)) ([db1c26b](https://github.com/speclynx/apidom/commit/db1c26b9b49baa370d3d776aad21c2ee2bca1cfb))
- **ls:** add OpenAPI 3.x validation for Paramter.style fixed field ([#73](https://github.com/speclynx/apidom/issues/73)) ([4820588](https://github.com/speclynx/apidom/commit/4820588e274f8ddd7a907ae95606d7bed678c1da))

## [1.4.2](https://github.com/speclynx/apidom/compare/v1.4.1...v1.4.2) (2025-08-30)

**Note:** Version bump only for package @speclynx/apidom-ls

## [1.4.1](https://github.com/speclynx/apidom/compare/v1.4.0...v1.4.1) (2025-08-26)
