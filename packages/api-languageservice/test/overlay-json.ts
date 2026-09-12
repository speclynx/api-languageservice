import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
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
import { logPerformance, logLevel, diagnosticText } from './test-utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const specOverlayJson = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'overlay', 'sample-overlay.json'))
  .toString();

describe('api-languageservice-overlay-json', function () {
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

  it('test namespace detection for overlay 1.1.0 json', async function () {
    const contentLanguage = await findNamespace(specOverlayJson);

    assert.strictEqual(contentLanguage.namespace, 'overlay');
    assert.strictEqual(contentLanguage.version, '1.1.0');
    assert.strictEqual(contentLanguage.format, 'JSON');
    assert.strictEqual(contentLanguage.mediaType, 'application/vnd.oai.overlay+json;version=1.1.0');
  });

  it('test validation for overlay 1.1.0 json produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docOverlayJson: TextDocument = TextDocument.create(
      'foo://bar/overlay.json',
      'json',
      0,
      specOverlayJson,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docOverlayJson, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test JSON Schema validation for overlay 1.1.0 json produces no errors', async function () {
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

    const docOverlayJson: TextDocument = TextDocument.create(
      'foo://bar/overlay.json',
      'json',
      0,
      specOverlayJson,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayJson, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(
      errors.length,
      0,
      `Expected no errors but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test validation for overlay 1.0.0 json produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const overlay10Json = JSON.stringify({
      overlay: '1.0.0',
      info: {
        title: 'Overlay for 1.0',
        version: '1.0.0',
      },
      actions: [
        {
          target: "$.paths['/users'].get",
          update: {
            description: 'Returns a list of users',
          },
        },
      ],
    });

    const docOverlayJson: TextDocument = TextDocument.create(
      'foo://bar/overlay10.json',
      'json',
      0,
      overlay10Json,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docOverlayJson, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test JSON Schema validation for overlay 1.0.0 json produces no errors', async function () {
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

    const overlay10Json = JSON.stringify({
      overlay: '1.0.0',
      info: {
        title: 'Overlay for 1.0',
        version: '1.0.0',
      },
      actions: [
        {
          target: "$.paths['/users'].get",
          update: {
            description: 'Returns a list of users',
          },
        },
      ],
    });

    const docOverlayJson: TextDocument = TextDocument.create(
      'foo://bar/overlay10.json',
      'json',
      0,
      overlay10Json,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayJson, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(
      errors.length,
      0,
      `Expected no errors but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test JSON Schema validation for overlay 1.0.0 json does not apply 1.1 pattern', async function () {
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

    const overlay10Json = JSON.stringify({
      overlay: '1.0.0',
      info: {
        title: 'Overlay for 1.0',
        version: '1.0.0',
      },
      actions: [
        {
          target: "$.paths['/users'].get",
          update: {
            description: 'Returns a list of users',
          },
        },
      ],
    });

    const docOverlayJson: TextDocument = TextDocument.create(
      'foo://bar/overlay10.json',
      'json',
      0,
      overlay10Json,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayJson, validationContext);

    const patternErrors = result.filter(
      (d) => d.source === 'Overlay 1 Schema' && diagnosticText(d.message).includes('pattern'),
    );
    assert.strictEqual(
      patternErrors.length,
      0,
      `Expected no pattern errors for overlay 1.0.0 but got: ${JSON.stringify(patternErrors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test JSON Schema validation catches missing required field (JSON)', async function () {
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
    const invalidOverlayJson = JSON.stringify({
      overlay: '1.1.0',
      info: {
        version: '1.0.0',
      },
      actions: [
        {
          target: '$.paths',
          update: {
            description: 'test',
          },
        },
      ],
    });

    const docOverlayJson: TextDocument = TextDocument.create(
      'foo://bar/invalid-overlay.json',
      'json',
      0,
      invalidOverlayJson,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayJson, validationContext);

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
});
