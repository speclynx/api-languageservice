import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { includesClasses } from '@speclynx/apidom-datamodel';

import getLanguageService from '../src/apidom-language-service.ts';
import {
  LanguageService,
  LanguageServiceContext,
  ValidationContext,
} from '../src/apidom-language-types.ts';
import { findNamespace } from '../src/utils/utils.ts';
import { parse } from '../src/parser-factory.ts';
import { Arazzo1JsonSchemaValidationProvider } from '../src/services/validation/providers/arazzo-1-json-schema-validation-provider.ts';
import { metadata } from './metadata.ts';
import { logPerformance, logLevel } from './test-utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const specArazzoJson101 = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'arazzo', 'sample-arazzo.json'))
  .toString();

describe('api-languageservice-arazzo-json', function () {
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

  it('test namespace detection for arazzo 1.0.1 json', async function () {
    const contentLanguage = await findNamespace(specArazzoJson101);

    assert.strictEqual(contentLanguage.namespace, 'arazzo');
    assert.strictEqual(contentLanguage.version, '1.0.1');
    assert.strictEqual(contentLanguage.format, 'JSON');
    assert.strictEqual(
      contentLanguage.mediaType,
      'application/vnd.oai.workflows+json;version=1.0.1',
    );
  });

  it('test validation for arazzo 1.0.1 json produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docArazzoJson: TextDocument = TextDocument.create(
      'foo://bar/arazzo.json',
      'json',
      0,
      specArazzoJson101,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docArazzoJson, validationContext);

    // Valid document should produce no errors
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test sourceDescriptionsResolution disabled by default (JSON)', async function () {
    const arazzoFilePath = path.join(__dirname, 'fixtures', 'arazzo', 'sample-arazzo.json');
    const docArazzoJson: TextDocument = TextDocument.create(
      pathToFileURL(arazzoFilePath).toString(),
      'json',
      0,
      specArazzoJson101,
    );

    // Without parseContext.arazzo.sourceDescriptionsResolution, source descriptions should NOT be resolved
    const result = await parse(docArazzoJson, metadata().metadataMaps);

    // ParseResult should only contain the main Arazzo document, no source description results
    const sourceDescriptionResults = [...result].filter((el) =>
      includesClasses(el, ['source-description']),
    );
    assert.strictEqual(
      sourceDescriptionResults.length,
      0,
      'Source descriptions should not be resolved when sourceDescriptionsResolution is disabled',
    );
  });

  it('test sourceDescriptionsResolution resolves relative URLs (JSON)', async function () {
    const arazzoFilePath = path.join(__dirname, 'fixtures', 'arazzo', 'sample-arazzo.json');
    const docArazzoJson: TextDocument = TextDocument.create(
      pathToFileURL(arazzoFilePath).toString(),
      'json',
      0,
      specArazzoJson101,
    );

    // Enable source descriptions resolution with file allow list
    const result = await parse(
      docArazzoJson,
      metadata().metadataMaps,
      true,
      true,
      true,
      undefined,
      {
        fileAllowList: ['*'],
        arazzo: { sourceDescriptionsResolution: true },
      },
    );

    // ParseResult should contain source description results
    const sourceDescriptionResults = [...result].filter((el) =>
      includesClasses(el, ['source-description']),
    );
    assert.isAtLeast(
      sourceDescriptionResults.length,
      1,
      'At least one source description should be resolved',
    );
  });

  it('test JSON Schema validation for arazzo 1.0.1 json produces no errors', async function () {
    const arazzoJsonSchemaValidationProvider = new Arazzo1JsonSchemaValidationProvider();

    const contextWithJsonSchema: LanguageServiceContext = {
      metadata: metadata(),
      validatorProviders: [arazzoJsonSchemaValidationProvider],
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

    const docArazzoJson: TextDocument = TextDocument.create(
      'foo://bar/arazzo.json',
      'json',
      0,
      specArazzoJson101,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docArazzoJson, validationContext);

    // Valid document should produce no errors
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(
      errors.length,
      0,
      `Expected no errors but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test JSON Schema validation catches missing required field (JSON)', async function () {
    const arazzoJsonSchemaValidationProvider = new Arazzo1JsonSchemaValidationProvider();

    const contextWithJsonSchema: LanguageServiceContext = {
      metadata: metadata(),
      validatorProviders: [arazzoJsonSchemaValidationProvider],
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

    // Invalid Arazzo document - missing required info.title field
    const invalidArazzoJson = JSON.stringify({
      arazzo: '1.0.1',
      info: {
        version: '1.0.0',
      },
      sourceDescriptions: [
        {
          name: 'petStore',
          type: 'openapi',
          url: './petstore.json',
        },
      ],
      workflows: [
        {
          workflowId: 'test-workflow',
          steps: [
            {
              stepId: 'step1',
              operationId: 'getUser',
            },
          ],
        },
      ],
    });

    const docArazzoJson: TextDocument = TextDocument.create(
      'foo://bar/invalid-arazzo.json',
      'json',
      0,
      invalidArazzoJson,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docArazzoJson, validationContext);

    // Should produce at least one error for missing required field
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.isAtLeast(errors.length, 1, 'Expected at least one error for missing required field');

    // Verify the error comes from the JSON Schema provider
    const jsonSchemaErrors = errors.filter((d) => d.source === 'Arazzo 1.0 Schema');
    assert.isAtLeast(
      jsonSchemaErrors.length,
      1,
      `Expected error from JSON Schema provider but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });
});
