import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity } from 'vscode-languageserver-types';

import getLanguageService from '../src/apidom-language-service.ts';
import {
  LanguageService,
  LanguageServiceContext,
  ValidationContext,
} from '../src/apidom-language-types.ts';
import { Arazzo11JsonSchemaValidationProvider } from '../src/services/validation/providers/arazzo-11-json-schema-validation-provider.ts';
import { metadata } from './metadata.ts';
import { logPerformance, logLevel } from './test-utils.ts';

const validArazzo11Yaml = `
arazzo: 1.1.0
$self: https://example.com/arazzo/pet-workflow.yaml
info:
  title: Sample Arazzo Workflow
  version: 1.0.0
sourceDescriptions:
  - name: petStore
    type: openapi
    url: ./petstore-openapi.yaml
  - name: petEvents
    type: asyncapi
    url: ./pet-events-asyncapi.yaml
workflows:
  - workflowId: get-pet-workflow
    steps:
      - stepId: get-pet
        operationId: $sourceDescriptions.petStore.getPetById
        timeout: 5000
        successCriteria:
          - condition: $statusCode == 200
        outputs:
          petName:
            context: $response.body
            selector: $.name
            type: jsonpath
      - stepId: watch-pet
        channelPath: $sourceDescriptions.petEvents.channels.petUpdated
        action: receive
        correlationId: $response.header.correlation-id
        dependsOn:
          - get-pet
        successCriteria:
          - condition: $statusCode == 200
`;

describe('api-languageservice-arazzo-11-json-schema', function () {
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

  it('test namespace detection for arazzo 1.1.0 yaml', async function () {
    const doc: TextDocument = TextDocument.create(
      'foo://bar/arazzo.yaml',
      'yaml',
      0,
      validArazzo11Yaml,
    );

    const languageService: LanguageService = getLanguageService(context);
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test JSON Schema validation for a valid arazzo 1.1.0 document produces no errors', async function () {
    const arazzoJsonSchemaValidationProvider = new Arazzo11JsonSchemaValidationProvider();

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

    const doc: TextDocument = TextDocument.create(
      'foo://bar/arazzo.yaml',
      'yaml',
      0,
      validArazzo11Yaml,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(
      errors.length,
      0,
      `Expected no errors but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test JSON Schema validation catches a step missing action for a channelPath step', async function () {
    const arazzoJsonSchemaValidationProvider = new Arazzo11JsonSchemaValidationProvider();

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

    const invalidSpec = `
arazzo: 1.1.0
info:
  title: Sample Arazzo Workflow
  version: 1.0.0
sourceDescriptions:
  - name: petEvents
    type: asyncapi
    url: ./pet-events-asyncapi.yaml
workflows:
  - workflowId: watch-pet-workflow
    steps:
      - stepId: watch-pet
        channelPath: $sourceDescriptions.petEvents.channels.petUpdated
        successCriteria:
          - condition: $statusCode == 200
`;

    const doc: TextDocument = TextDocument.create(
      'foo://bar/invalid-arazzo.yaml',
      'yaml',
      0,
      invalidSpec,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.isAtLeast(errors.length, 1, 'Expected at least one error for missing required action');

    const jsonSchemaErrors = errors.filter((d) => d.source === 'Arazzo 1.1 Schema');
    assert.isAtLeast(
      jsonSchemaErrors.length,
      1,
      `Expected error from JSON Schema provider but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });
});
