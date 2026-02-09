<h1 align="center">SpecLynx ApiDOM Language Service</h1>

<p align="center">
  A comprehensive <strong>Language Service Library</strong> for API description languages, built on <a href="https://github.com/speclynx/apidom">SpecLynx ApiDOM</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@speclynx/apidom-ls"><img src="https://img.shields.io/npm/v/@speclynx/apidom-ls.svg" alt="npm version"></a>
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License: Apache 2.0">
</p>

<div align="center">
    <a href="https://speclynx.com"><img alt="SpecLynx Logo" src="https://github.com/user-attachments/assets/1cfd6c8e-0206-4d53-9a2c-e4d10be84ca0" /></a>
</div>

---

## Overview

**SpecLynx ApiDOM Language Service** (`@speclynx/apidom-ls`) is a language service library that provides intelligent editing features for API description languages. It implements programmatic language features following the [Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/) specification, making it easy to integrate into any LSP-compatible editor or IDE through a server wrapper.

> **Note:** This is a *language service*, not a language server. A language service is a library that implements language features, while a language server is a separate process that communicates via LSP. This library can be wrapped by an LSP server to expose its features to editors.

## Supported Languages

| Language | Versions                          | Formats |
|----------|-----------------------------------|---------|
| [**OpenAPI**](https://spec.openapis.org/oas/) | 2.0, 3.0.0, 3.0.1, 3.0.2, 3.0.3, 3.0.4, 3.1.0, 3.1.1, 3.1.2 | JSON, YAML |
| [**AsyncAPI**](https://v2.asyncapi.com/docs/reference/specification/v2.6.0) | 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6 | JSON, YAML |
| [**Arazzo**](https://spec.openapis.org/arazzo/latest.html) | 1.0.0, 1.0.1 | JSON, YAML |
| [**JSON Schema**](https://json-schema.org/specification-links) | Draft 4/5, 6, 7, 2019-09, 2020-12 | JSON, YAML |

## Features

The language service provides the following LSP-compatible features:

| Feature | Method | Description |
|---------|--------|-------------|
| **Validation** | `doValidation()` | Syntax and semantic validation with diagnostics |
| **Completion** | `doCompletion()` | Context-aware auto-completion suggestions |
| **Hover** | `doHover()` | Documentation and type information on hover |
| **Go to Definition** | `doProvideDefinition()` | Navigate to `$ref` target definitions |
| **Find References** | `doProvideReferences()` | Find all references to a symbol |
| **Document Symbols** | `doFindDocumentSymbols()` | Outline view and breadcrumbs |
| **Semantic Tokens** | `computeSemanticTokens()` | Enhanced syntax highlighting |
| **Code Actions** | `doCodeActions()` | Quick fixes and refactoring |
| **Document Links** | `doLinks()` | Clickable links in documents |
| **Formatting** | `doFormatting()` | Document formatting |
| **Dereferencing** | `doDeref()` | Resolve all `$ref` references |
| **Format Conversion** | `doConversion()` | Convert between JSON and YAML |
| **Color Support** | `findDocumentColors()` | Color picker for color values |

## Installation

```sh
npm install @speclynx/apidom-ls
```

## Quick Start

### Basic Setup

```typescript
import { getLanguageService } from '@speclynx/apidom-ls';
import { TextDocument } from 'vscode-languageserver-textdocument';

// Create the language service
const languageService = getLanguageService({});

// Create a document from your API specification
const spec = `
openapi: "3.1.0"
info:
  title: My API
  version: 1.0.0
paths: {}
`;

const document = TextDocument.create(
  'file:///api.yaml',
  'yaml',
  0,
  spec
);
```

### Validation

```typescript
const diagnostics = await languageService.doValidation(document);

for (const diagnostic of diagnostics) {
  console.log(`[${diagnostic.severity}] Line ${diagnostic.range.start.line}: ${diagnostic.message}`);
}
```

### Auto-Completion

```typescript
import { Position } from 'vscode-languageserver-types';

const position = Position.create(4, 2); // line 4, character 2
const completions = await languageService.doCompletion(document, {
  textDocument: { uri: document.uri },
  position
});

console.log('Suggestions:', completions?.items.map(item => item.label));
```

### Hover Information

```typescript
const hover = await languageService.doHover(document, Position.create(1, 5));

if (hover) {
  console.log('Hover content:', hover.contents);
}
```

### Go to Definition

```typescript
const definition = await languageService.doProvideDefinition(document, {
  textDocument: { uri: document.uri },
  position: Position.create(10, 15) // position on a $ref value
});

if (definition) {
  console.log('Definition location:', definition.uri, definition.range);
}
```

### Cleanup

```typescript
// Always terminate when done to free resources
languageService.terminate();
```

## Advanced Configuration

The language service can be configured with custom providers and settings:

```typescript
import { getLanguageService, LogLevel } from '@speclynx/apidom-ls';

const languageService = getLanguageService({
  // Logging configuration
  logLevel: LogLevel.WARN,
  performanceLogs: false,

  // Custom validation providers
  validatorProviders: [/* custom validators */],

  // Custom completion providers
  completionProviders: [/* custom completions */],

  // Custom hover providers
  hoverProviders: [/* custom hovers */],

  // Enable clickable links for URLs in hover
  hoverFollowLinkEntry: true,
});
```

## Architecture

```
        ┌─────────────────────────────────────┐
        │          Your Application           │
        │      (IDE, Editor, CLI, etc.)       │
        └─────────────────┬───────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │         LSP Server Wrapper          │
        │      (implements LSP protocol)      │
        └─────────────────┬───────────────────┘
                          │
                          ▼
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║       SpecLynx ApiDOM Language Service        ║
  ║            (this language service)            ║
  ║                                               ║
  ╚═══════════════════════╤═══════════════════════╝
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │           SpecLynx ApiDOM           │
        │   parsing ∙ datamodel ∙ traversal   │
        └─────────────────────────────────────┘
```

## Support & Documentation

For full documentation and **enterprise support** please contact: **info@speclynx.com**

## License

ApiDOM Language Service is licensed under [Apache 2.0 license](https://github.com/speclynx/apidom/blob/main/LICENSES/Apache-2.0.txt).
ApiDOM Language Service comes with an explicit **NOTICE** file inside npm distribution package
containing additional legal notices and information.

This project uses [REUSE specification](https://reuse.software/spec/) that defines a standardized method
for declaring copyright and licensing for software projects.
