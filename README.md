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

`@speclynx/apidom-ls@2.13.0` is a final compatibility release that forwards every entry point to
the renamed package, so upgrading to it changes nothing. It is the last release under the old
name and is deprecated on publication. The migration is a change of name and no more; see
[`packages/apidom-ls-compat/README.md`](packages/apidom-ls-compat/README.md).

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

An SBOM is available from this repository's
[dependency graph](https://github.com/speclynx/api-languageservice/network/dependencies): click
`Export SBOM` to download it in [SPDX format](https://spdx.dev/).
