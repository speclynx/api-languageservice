# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.9.0](https://github.com/speclynx/apidom/compare/v1.8.0...v1.9.0) (2025-09-28)

### Features

- **ls:** add OpenAPI 3.1.2 support in openapi config ([#90](https://github.com/speclynx/apidom/issues/90)) ([f5a7c84](https://github.com/speclynx/apidom/commit/f5a7c84a225255fc764086246b0fd0bef9c55962))

# [1.8.0](https://github.com/speclynx/apidom/compare/v1.7.1...v1.8.0) (2025-09-27)

### Features

- **ls:** add support for OpenAPI 3.1.2 ([#89](https://github.com/speclynx/apidom/issues/89)) ([23bde06](https://github.com/speclynx/apidom/commit/23bde061203f67dbe835e8dc5ab8e104d53cf572))
- **ns-openapi-3-1:** add support for OpenAPI 3.1.2 ([#85](https://github.com/speclynx/apidom/issues/85)) ([8ea1767](https://github.com/speclynx/apidom/commit/8ea1767b1be31b1010bd4da839f2150006ec7da6))
- **parser-adapter-openapi-json-3-1:** add support for OpenAPI 3.1.2 ([#86](https://github.com/speclynx/apidom/issues/86)) ([d435999](https://github.com/speclynx/apidom/commit/d435999bdf05dcec3359425b6e23b08c17fe97b7))
- **parser-adapter-openapi-yaml-3-1:** add support for OpenAPI 3.1.2 ([#87](https://github.com/speclynx/apidom/issues/87)) ([8cdb1d9](https://github.com/speclynx/apidom/commit/8cdb1d916ff44f11c91e4b19d53ff8e0050b689e))
- **reference:** add support for OpenAPI 3.1.2 ([#88](https://github.com/speclynx/apidom/issues/88)) ([d6f487a](https://github.com/speclynx/apidom/commit/d6f487a2f51c1177087c2baa12b5779018ea33bc))

## [1.7.1](https://github.com/speclynx/apidom/compare/v1.7.0...v1.7.1) (2025-09-06)

### Bug Fixes

- **apidom-ns-asyncapi-2:** fix TypeScript types ([#81](https://github.com/speclynx/apidom/issues/81)) ([8c79f94](https://github.com/speclynx/apidom/commit/8c79f94fb63d6292d5494db115a743597da9ccab))

# [1.7.0](https://github.com/speclynx/apidom/compare/v1.6.0...v1.7.0) (2025-09-05)

### Bug Fixes

- fix order of refracting within the mixed fields visitor ([#80](https://github.com/speclynx/apidom/issues/80)) ([3838872](https://github.com/speclynx/apidom/commit/38388725560e3d427e896cd88afd02b6cc77e1ff)), closes [#63](https://github.com/speclynx/apidom/issues/63)
- **reference:** make isFileSystemPath work in browser ([#79](https://github.com/speclynx/apidom/issues/79)) ([9833e06](https://github.com/speclynx/apidom/commit/9833e063cceb0fff3c37a28df621fc410782185f)), closes [#76](https://github.com/speclynx/apidom/issues/76)

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

### Bug Fixes

- safely parse malformed JSON strings ([#72](https://github.com/speclynx/apidom/issues/72)) ([171fff7](https://github.com/speclynx/apidom/commit/171fff7d27339a9a687c4653d66b5da2763b4bd0))

## [1.4.1](https://github.com/speclynx/apidom/compare/v1.4.0...v1.4.1) (2025-08-26)

### Bug Fixes

- remove SmartBear & Swagger references ([af483d8](https://github.com/speclynx/apidom/commit/af483d8973b836eb66e9702a95ffa1ebff3f4791))

# [1.4.0](https://github.com/speclynx/apidom/compare/v1.3.0...v1.4.0) (2025-07-17)

### Bug Fixes

- **apidom-ls:** enhance and fix issues in JSON Schema validation ([1892ca0](https://github.com/speclynx/apidom/commit/1892ca0b3edb07b30ea84655012772f0f2371824))
- **apidom-ls:** fix ast-original-yaml-js.ts file name ([801535a](https://github.com/speclynx/apidom/commit/801535aa3ab2a34b70e50c1cb96cd46aaa78043a))
- **apidom-ls:** fix yaml parsing in json schema validation stand-alone ([baa6e79](https://github.com/speclynx/apidom/commit/baa6e79a90a88b8eecc017725325933d88cd36f2))

### Features

- **apidom-ls:** add support for @spotlight/bettter-ajv-errors ([e910065](https://github.com/speclynx/apidom/commit/e9100650af4f3b7bf8f3ff548e98377fd6df4f26))
- **apidom-ls:** enhance JSON Schema validation support ([2e1d67a](https://github.com/speclynx/apidom/commit/2e1d67afce0af57d141da2365601bb74c0eb9dea))
- **apidom-ls:** update config for JSON Schema validation ([a1073db](https://github.com/speclynx/apidom/commit/a1073db8aa03280cca4ef58765625bf986e020e9))

# [1.3.0](https://github.com/speclynx/apidom/compare/v1.2.0...v1.3.0) (2025-07-11)

### Features

- **ls:** implement correct findReferences ([#50](https://github.com/speclynx/apidom/issues/50)) ([4d2f850](https://github.com/speclynx/apidom/commit/4d2f850a45f78f69c558a770e866f9bac30639c6))
- use speclynx as publishing scope ([#65](https://github.com/speclynx/apidom/issues/65)) ([0a9b57e](https://github.com/speclynx/apidom/commit/0a9b57ea52ada33b3b0045814ff5fdcfbb0067aa)), closes [#61](https://github.com/speclynx/apidom/issues/61)

# [1.2.0](https://github.com/speclynx/apidom/compare/v1.1.1...v1.2.0) (2025-06-16)

### Features

- simplify usage of tree-sitter ([#34](https://github.com/speclynx/apidom/issues/34)) ([a019825](https://github.com/speclynx/apidom/commit/a01982595dc5859b188e1132dd980d23c6b372db))

## [1.1.1](https://github.com/speclynx/apidom/compare/v1.1.0...v1.1.1) (2025-06-08)

### Bug Fixes

- add deterministic parser grammar loading ([03081b7](https://github.com/speclynx/apidom/commit/03081b72005b8688261d14cbcdd23ecbb22cd31f))

# 1.1.0 (2025-06-06)

### Bug Fixes

- **release:** publish to GitHub Package registry ([4de6c21](https://github.com/speclynx/apidom/commit/4de6c217f08cd49964273b9087d5df153306fc6e))
- **release:** publish to GitHub Package registry ([2f2f225](https://github.com/speclynx/apidom/commit/2f2f225f4827537a18162d9f12caf39267e76b04))
- **release:** use proper GitHub release & tag ([7f670b2](https://github.com/speclynx/apidom/commit/7f670b2f91080f639c7bb4d60954ec4aea8f91c8))

### Features

- change package naming ([#11](https://github.com/speclynx/apidom/issues/11)) ([a7e71af](https://github.com/speclynx/apidom/commit/a7e71afd48f14311e02d93b0881cf634cb342beb))
- make tree-sitter grammars a dev dependency only ([25c44e1](https://github.com/speclynx/apidom/commit/25c44e198c42156b08863f4b5c7c4b692776fe71))
- **parser-adapter-json:** drop using tree-sitter Node.js bindings ([a242b60](https://github.com/speclynx/apidom/commit/a242b60c359270cf438a14024c00d4eb48581ed0))
- **parser-adapter-yaml-1-2:** drop using tree-sitter Node.js bindings ([90f3300](https://github.com/speclynx/apidom/commit/90f33007254e0a20388dc0ce17f44e8f0eee8b3d))
