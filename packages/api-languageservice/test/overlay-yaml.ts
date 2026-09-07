import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { fileURLToPath } from 'node:url';

import getLanguageService from '../src/apidom-language-service.ts';
import {
  LanguageService,
  LanguageServiceContext,
  ValidationContext,
} from '../src/apidom-language-types.ts';
import { findNamespace } from '../src/utils/utils.ts';
import { Overlay1JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-1-json-schema-validation-provider.ts';
import { metadata } from './metadata.ts';
import { logPerformance, logLevel } from './test-utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const specOverlayYaml = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'overlay', 'sample-overlay.yaml'))
  .toString();

const specOverlay10Yaml = `overlay: "1.0.0"
info:
  title: Overlay for 1.0
  version: "1.0.0"
actions:
  - target: "$.paths['/users'].get"
    update:
      description: Returns a list of users
`;

describe('api-languageservice-overlay-yaml', function () {
  const context: LanguageServiceContext = {
    metadata: metadata(),
    validationContext: {
      jsonSchemaValidation: true,
      semanticValidation: true,
      referenceValidation: false,
      semanticLinting: true,
    },
    performanceLogs: logPerformance,
    logLevel,
  };

  it('test namespace detection for overlay 1.1.0 yaml', async function () {
    const contentLanguage = await findNamespace(specOverlayYaml);

    assert.strictEqual(contentLanguage.namespace, 'overlay');
    assert.strictEqual(contentLanguage.version, '1.1.0');
    assert.strictEqual(contentLanguage.format, 'YAML');
    assert.strictEqual(contentLanguage.mediaType, 'application/vnd.oai.overlay+yaml;version=1.1.0');
  });

  it('test validation for overlay 1.1.0 yaml produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay.yaml',
      'yaml',
      0,
      specOverlayYaml,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test JSON Schema validation for overlay 1.1.0 yaml produces no errors', async function () {
    const overlayJsonSchemaValidationProvider = new Overlay1JsonSchemaValidationProvider();

    const contextWithJsonSchema: LanguageServiceContext = {
      metadata: metadata(),
      validatorProviders: [overlayJsonSchemaValidationProvider],
      validationContext: {
        jsonSchemaValidation: true,
        semanticValidation: true,
        referenceValidation: false,
        semanticLinting: true,
      },
      performanceLogs: logPerformance,
      logLevel,
    };

    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay.yaml',
      'yaml',
      0,
      specOverlayYaml,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(
      errors.length,
      0,
      `Expected no errors but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test validation for overlay 1.0.0 yaml produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay10.yaml',
      'yaml',
      0,
      specOverlay10Yaml,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test JSON Schema validation for overlay 1.0.0 yaml produces no errors', async function () {
    const overlayJsonSchemaValidationProvider = new Overlay1JsonSchemaValidationProvider();

    const contextWithJsonSchema: LanguageServiceContext = {
      metadata: metadata(),
      validatorProviders: [overlayJsonSchemaValidationProvider],
      validationContext: {
        jsonSchemaValidation: true,
        semanticValidation: true,
        referenceValidation: false,
        semanticLinting: true,
      },
      performanceLogs: logPerformance,
      logLevel,
    };

    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay10.yaml',
      'yaml',
      0,
      specOverlay10Yaml,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(
      errors.length,
      0,
      `Expected no errors but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test JSON Schema validation for overlay 1.0.0 does not apply 1.1 pattern', async function () {
    const overlayJsonSchemaValidationProvider = new Overlay1JsonSchemaValidationProvider();

    const contextWithJsonSchema: LanguageServiceContext = {
      metadata: metadata(),
      validatorProviders: [overlayJsonSchemaValidationProvider],
      validationContext: {
        jsonSchemaValidation: true,
        semanticValidation: false,
        referenceValidation: false,
        semanticLinting: false,
      },
      performanceLogs: logPerformance,
      logLevel,
    };

    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay10.yaml',
      'yaml',
      0,
      specOverlay10Yaml,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const patternErrors = result.filter(
      (d) => d.source === 'Overlay 1 Schema' && d.message.includes('pattern'),
    );
    assert.strictEqual(
      patternErrors.length,
      0,
      `Expected no pattern errors for overlay 1.0.0 but got: ${JSON.stringify(patternErrors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test JSON Schema validation catches missing required field (YAML)', async function () {
    const overlayJsonSchemaValidationProvider = new Overlay1JsonSchemaValidationProvider();

    const contextWithJsonSchema: LanguageServiceContext = {
      metadata: metadata(),
      validatorProviders: [overlayJsonSchemaValidationProvider],
      validationContext: {
        jsonSchemaValidation: true,
        semanticValidation: false,
        referenceValidation: false,
        semanticLinting: false,
      },
      performanceLogs: logPerformance,
      logLevel,
    };

    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    // Invalid Overlay document - missing required info.title field
    const invalidOverlayYaml = `overlay: "1.1.0"
info:
  version: "1.0.0"
actions:
  - target: "$.paths"
    update:
      description: test
`;

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/invalid-overlay.yaml',
      'yaml',
      0,
      invalidOverlayYaml,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.isAtLeast(errors.length, 1, 'Expected at least one error for missing required field');

    const jsonSchemaErrors = errors.filter((d) => d.source === 'Overlay 1 Schema');
    assert.isAtLeast(
      jsonSchemaErrors.length,
      1,
      `Expected error from JSON Schema provider but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test hover for overlay 1.0.0 provides documentation on info key', async function () {
    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay10.yaml',
      'yaml',
      0,
      specOverlay10Yaml,
    );

    const languageService: LanguageService = getLanguageService(context);

    const hoverResult = await languageService.doHover(docOverlayYaml, Position.create(1, 0));

    assert.isNotNull(hoverResult, 'Expected hover result for info key');
    const contents = hoverResult!.contents;
    const value =
      typeof contents === 'string' ? contents : 'value' in contents ? contents.value : '';
    assert.include(value, 'Info Object', 'Expected hover to contain Info Object documentation');

    languageService.terminate();
  });

  it('test completion for overlay 1.0.0 provides action fields without copy', async function () {
    const overlay10WithCursor = `overlay: "1.0.0"
info:
  title: Overlay for 1.0
  version: "1.0.0"
actions:
  - target: "$.paths['/users'].get"
    `;

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay10.yaml',
      'yaml',
      0,
      overlay10WithCursor,
    );

    const languageService: LanguageService = getLanguageService(context);

    const completions = await languageService.doCompletion(docOverlayYaml, Position.create(6, 4));

    const labels = completions?.items?.map((i) => i.label) ?? [];
    assert.include(labels, 'description', 'Expected description completion');
    assert.include(labels, 'update', 'Expected update completion');
    assert.include(labels, 'remove', 'Expected remove completion');
    assert.notInclude(labels, 'copy', 'copy should not be offered in Overlay 1.0');

    languageService.terminate();
  });
});
