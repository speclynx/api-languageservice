# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.5.0](https://github.com/speclynx/apidom-internal/compare/v2.4.3...v2.5.0) (2026-03-16)

### Bug Fixes

- **apidom-ls:** address PR [#138](https://github.com/speclynx/apidom-internal/issues/138) review comments ([4823a47](https://github.com/speclynx/apidom-internal/commit/4823a4771128ebd643dc576975ffd59735301d47))
- **apidom-ls:** gate all per-phase profiling behind debug check ([df76791](https://github.com/speclynx/apidom-internal/commit/df76791ed2a6f3bdde34fe2b3f868a2b4433df77))

### Features

- **apidom-ls:** add lint rule for "items" in array schemas ([daa8c89](https://github.com/speclynx/apidom-internal/commit/daa8c899970411f4c4b416b07e28d70c3271791b))

### Performance Improvements

- **apidom-ls:** cache full-tree traversals in linter functions ([765afdb](https://github.com/speclynx/apidom-internal/commit/765afdba6b54f415d00cdd233f75c7215e3f2b6d))
- **apidom-ls:** fix O(n^2) uniqueness check, add profiling ([4edd520](https://github.com/speclynx/apidom-internal/commit/4edd520f44b76857768225d9a8834e57ef3f02c4))
- **apidom-ls:** optimize validation and linting performance ([09a16f7](https://github.com/speclynx/apidom-internal/commit/09a16f7308ab5f1c941a529967ce21f9c4438a19))

## [2.4.3](https://github.com/speclynx/apidom-internal/compare/v2.4.2...v2.4.3) (2026-03-12)

### Bug Fixes

- **release:** override minimatch 10.2.3 to fix glob pattern regression in lerna publish ([#135](https://github.com/speclynx/apidom-internal/issues/135)) ([221e330](https://github.com/speclynx/apidom-internal/commit/221e330f6d7df9774d4dee3250f951d0972386ae)), closes [lerna/lerna#4305](https://github.com/lerna/lerna/issues/4305) [isaacs/minimatch#284](https://github.com/isaacs/minimatch/issues/284)

## [2.4.2](https://github.com/speclynx/apidom-internal/compare/v2.4.1...v2.4.2) (2026-03-11)

### Bug Fixes

- **release:** avoid including \*.ts files in npm dist ([8405fc4](https://github.com/speclynx/apidom-internal/commit/8405fc46ee455bd369cbfb03bd8d1427a5a6eb4b))

## [2.4.1](https://github.com/speclynx/apidom-internal/compare/v2.4.0...v2.4.1) (2026-03-11)

### Bug Fixes

- **release:** avoid including \*.ts files in npm dist ([1211afa](https://github.com/speclynx/apidom-internal/commit/1211afa639d4eab1c82415a3807ddf85ebf298f2))

# [2.4.0](https://github.com/speclynx/apidom-internal/compare/v2.3.0...v2.4.0) (2026-03-11)

### Features

- integrate with SpecLynx ApiDOM v4 ([#134](https://github.com/speclynx/apidom-internal/issues/134)) ([091c737](https://github.com/speclynx/apidom-internal/commit/091c737646671d44879ada772f491b4f7d638513))

# [2.3.0](https://github.com/speclynx/apidom-internal/compare/v2.2.3...v2.3.0) (2026-03-09)

### Features

- adapt to SpecLynx ApiDOM v3.2.0 ([#133](https://github.com/speclynx/apidom-internal/issues/133)) ([c2ce3b1](https://github.com/speclynx/apidom-internal/commit/c2ce3b195f12fb32a39ef3c7eeedfdd4a5d87cb6))

## [2.2.3](https://github.com/speclynx/apidom-internal/compare/v2.2.2...v2.2.3) (2026-02-24)

### Bug Fixes

- **ls:** parse document larger than 32768 lines ([#132](https://github.com/speclynx/apidom-internal/issues/132)) ([4e70fb8](https://github.com/speclynx/apidom-internal/commit/4e70fb82b3c6122c4838894e0351ee3d8abfe6cf))

## [2.2.2](https://github.com/speclynx/apidom-internal/compare/v2.2.1...v2.2.2) (2026-02-12)

**Note:** Version bump only for package apidom-internal-monorepo

## [2.2.1](https://github.com/speclynx/apidom-internal/compare/v2.2.0...v2.2.1) (2026-02-11)

### Bug Fixes

- **ls:** remove console.log from validation service ([0dfd771](https://github.com/speclynx/apidom-internal/commit/0dfd771d5326a100d8c1824c629fecaeb6a7455c))

# [2.2.0](https://github.com/speclynx/apidom-internal/compare/v2.1.0...v2.2.0) (2026-02-10)

### Features

- **ls:** add support for Arazzo 1.0.x JSON Schema validation ([#124](https://github.com/speclynx/apidom-internal/issues/124)) ([4c73469](https://github.com/speclynx/apidom-internal/commit/4c73469f941ab4f5013549bdaa4a2fb750042df1))

# [2.1.0](https://github.com/speclynx/apidom-internal/compare/v2.0.2...v2.1.0) (2026-02-09)

### Features

- **ls:** add support for Arazzo 1.0.1 ([#123](https://github.com/speclynx/apidom-internal/issues/123)) ([2538753](https://github.com/speclynx/apidom-internal/commit/2538753d45a86b0fdbc03d10ed75e027a60c3536))

## [2.0.2](https://github.com/speclynx/apidom-internal/compare/v2.0.1...v2.0.2) (2026-02-08)

### Bug Fixes

- **release:** disable provenance ([a300c1a](https://github.com/speclynx/apidom-internal/commit/a300c1af6c1804a012976b0127cefc5038b0259c))

## [2.0.1](https://github.com/speclynx/apidom-internal/compare/v1.11.0...v2.0.1) (2026-02-08)

### Bug Fixes

- **release:** use trusted publishing ([525686f](https://github.com/speclynx/apidom-internal/commit/525686fb854f096f0316528d96a05628d2b979a5))
