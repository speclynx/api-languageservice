# SpecLynx API Language Service

[![Build Status](https://github.com/speclynx/api-languageservice/actions/workflows/build.yml/badge.svg)](https://github.com/speclynx/api-languageservice/actions)
[![Dependabot enabled](https://badgen.net/badge/icon/dependabot?icon=dependabot&label)](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-3.0-40c463.svg)](https://github.com/speclynx/api-languageservice/blob/HEAD/CODE_OF_CONDUCT.md)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/speclynx/api-languageservice/blob/HEAD/LICENSE)
[![npm version](https://img.shields.io/npm/v/@speclynx/api-languageservice.svg)](https://www.npmjs.com/package/@speclynx/api-languageservice)

<div align="center">
    <a href="https://speclynx.com"><img width="636" height="407" alt="SpecLynx" src="https://github.com/user-attachments/assets/1cfd6c8e-0206-4d53-9a2c-e4d10be84ca0" /></a>
</div>

`@speclynx/api-languageservice` gives an editor everything it needs to be intelligent about an
API description: validation with diagnostics, context-aware completion, hover documentation,
go-to-definition across `$ref`, document symbols, semantic tokens, quick fixes, links,
formatting, dereferencing and JSON/YAML conversion. It works on OpenAPI 2.0 through 3.1.2,
AsyncAPI 2.x, Arazzo 1.x, Overlay 1.x and JSON Schema from draft 4 to 2020-12, in both JSON and
YAML, and it is built on [SpecLynx ApiDOM](https://github.com/speclynx/apidom).

> **This is a language *service*, not a language *server*.** A language service is a library
> that implements language features; a language server is a process that speaks
> [LSP](https://microsoft.github.io/language-server-protocol/) over a transport. This library is
> what an LSP server wraps, and it can be embedded directly by anything that is not a server at
> all — an editor plugin, a CLI, a review tool.

## Installation

```sh
npm install @speclynx/api-languageservice
```

```typescript
import { getLanguageService } from '@speclynx/api-languageservice';
import { TextDocument } from 'vscode-languageserver-textdocument';

const languageService = getLanguageService({});
const document = TextDocument.create('file:///openapi.yaml', 'yaml', 0, source);
const diagnostics = await languageService.doValidation(document);
```

The full feature list, the API reference and worked examples are in the package's own README:
[`packages/api-languageservice/README.md`](packages/api-languageservice/README.md).

## Renamed from `@speclynx/apidom-ls`

This project was published as `@speclynx/apidom-ls` up to version 2.12.0, from a private
repository. From 2.13.0 it is published as `@speclynx/api-languageservice` from this one.

[`@speclynx/apidom-ls@2.13.0`](https://www.npmjs.com/package/@speclynx/apidom-ls) is a final
compatibility release that forwards every entry point to the renamed package, so upgrading to it
changes nothing. It is the last release under the old name and every version of it is deprecated.
The migration is a change of dependency and import specifier and no more:

```diff
-import { getLanguageService } from '@speclynx/apidom-ls';
+import { getLanguageService } from '@speclynx/api-languageservice';
```

## Contributing

Bug reports, feature requests and pull requests are all welcome. Setup instructions, the npm
scripts, the build artifacts and the branching and commit conventions are in
[`CONTRIBUTING.md`](CONTRIBUTING.md); participation is governed by the
[Code of Conduct](CODE_OF_CONDUCT.md).

To report a security issue, follow [`.github/SECURITY.md`](.github/SECURITY.md) rather than
opening a public issue.

## Documentation

The validation rules engine — how `LinterMeta` rules are evaluated, the built-in linter
functions, and how to add rules of your own — is documented in
[`docs/rules-engine.md`](docs/rules-engine.md).

## License

Licensed under the [Apache 2.0 license](LICENSE). The repository carries an explicit
[NOTICE](NOTICE) with additional legal notices, and each published package ships a
`dist/THIRD-PARTY-NOTICES.txt` listing the licence of every dependency embedded in its browser
bundle.

This project uses the [REUSE specification](https://reuse.software/spec/), which defines a
standardized method for declaring copyright and licensing for software projects.

## Software Bill of Materials (SBOM)

Every release attaches a [CycloneDX](https://cyclonedx.org/) SBOM of
`@speclynx/api-languageservice` to its
[GitHub release](https://github.com/speclynx/api-languageservice/releases). It is generated after
publishing, from the published package installed from the registry the way a consumer installs
it, so its subject carries the URL and hash the registry serves for that version, and it lists
the dependency tree that installing the release brought in at that moment. The code the package
contains, rather than installs, is listed inside the package. That covers the files it copied or
ported from other packages, whose pedigree names the package and version each came from. It also
covers the packages embedded in its browser bundle, `dist/api-languageservice.browser.min.js`, at
the versions the bundle was built with, which can differ from the ones a consumer installs.

An SBOM of the whole repository, development dependencies included, is available from its
[dependency graph](https://github.com/speclynx/api-languageservice/network/dependencies): click
`Export SBOM` to download it in [SPDX format](https://spdx.dev/).

## Dependency policy and supply chain

`@speclynx/api-languageservice` does not depend at runtime on components that are end-of-life or
unmaintained, and it has no optional dependencies: an integration that not every consumer needs
would be an optional peer dependency, which npm does not install unless asked. Code taken from
another package is copied with its licence header and credited in [NOTICE](NOTICE), in
`dist/THIRD-PARTY-NOTICES.txt` and in the SBOM. At present that is Ajv's `ucs2length` and
`fast-deep-equal`, which the JSON Schema validators Ajv generates at build time use, and the error
formatter ported from `@stoplight/better-ajv-errors`.

On every pull request, CI installs the packed package into a scratch project and fails if its tree
contains a component that a dependency policy scan has flagged before, Ajv among them; the list is
in [`scripts/package-contract-probe.mjs`](scripts/package-contract-probe.mjs). Policy findings are
triaged for every release.

Releases are published from GitHub Actions with npm provenance. To verify the registry signatures
and provenance attestations of the packages installed in a project, run:

```sh
npm audit signatures
```

### Accepted finding: Axios

`@speclynx/apidom-reference` resolves HTTP references with Axios, which supports the HTTP proxies
and custom agents enterprise networks need, so Axios stays. Policy scans that flag components
older than five years report some of its dependencies; the finding concerns their age, not a
known vulnerability. As of October 2026 these are `asynckit@0.4.0`, `combined-stream@1.0.8` and
`delayed-stream@1.0.0`, through `form-data@4.0.6`, and `agent-base@6.0.2` and `ms@2.1.3`, through
`https-proxy-agent@5.0.1`. `mime-db@1.52.0`, `mime-types@2.1.35` and `https-proxy-agent@5.0.1`
itself reach five years between February and April 2027. A waiver for this finding should name
the components as the scan report lists them, which can be these dependencies rather than `axios`
itself.
