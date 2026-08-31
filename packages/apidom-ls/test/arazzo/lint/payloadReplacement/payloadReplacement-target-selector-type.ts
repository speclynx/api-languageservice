import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity } from 'vscode-languageserver-types';

import getLanguageService from '../../../../src/apidom-language-service.ts';
import {
  LanguageService,
  LanguageServiceContext,
  ValidationContext,
} from '../../../../src/apidom-language-types.ts';
import { metadata } from './../../../metadata.ts';
import { logPerformance, logLevel } from './../../../test-utils.ts';
import codes from '../../../../src/config/codes.ts';

const specTemplate = (targetSelectorType: string): string => `
arazzo: 1.1.0
info:
  title: Sample Arazzo Workflow
  version: 1.0.1
sourceDescriptions:
  - name: petStore
    type: openapi
    url: ./petstore-openapi.yaml
workflows:
  - workflowId: create-pet-workflow
    steps:
      - stepId: create-pet
        operationId: $sourceDescriptions.petStore.createPet
        requestBody:
          contentType: application/json
          replacements:
            - target: /name
${targetSelectorType}
              value: Fido
        successCriteria:
          - condition: $statusCode == 201
`;

describe('test-arazzo-linting-payloadReplacement-targetSelectorType', function () {
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

  it('test ARAZZO_PAYLOAD_REPLACEMENT_FIELD_TARGET_SELECTOR_TYPE_EQUALS', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docInvalid = TextDocument.create(
      'foo://bar/invalid.yaml',
      'yaml',
      0,
      specTemplate('              targetSelectorType: not-a-real-type'),
    );
    const docValid = TextDocument.create(
      'foo://bar/valid.yaml',
      'yaml',
      0,
      specTemplate('              targetSelectorType: jsonpointer'),
    );

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    assert(
      resultInvalid.some(
        (d) => d.code === codes.ARAZZO_PAYLOAD_REPLACEMENT_FIELD_TARGET_SELECTOR_TYPE_EQUALS,
      ),
      `Expected ARAZZO_PAYLOAD_REPLACEMENT_FIELD_TARGET_SELECTOR_TYPE_EQUALS error, got: ${JSON.stringify(resultInvalid)}`,
    );

    const resultValid = await languageService.doValidation(docValid, validationContext);
    assert(
      resultValid.every(
        (d) => d.code !== codes.ARAZZO_PAYLOAD_REPLACEMENT_FIELD_TARGET_SELECTOR_TYPE_EQUALS,
      ),
      `Expected no ARAZZO_PAYLOAD_REPLACEMENT_FIELD_TARGET_SELECTOR_TYPE_EQUALS errors, got: ${JSON.stringify(resultValid)}`,
    );

    languageService.terminate();
  });

  it('test targetSelectorType accepts an Expression Type Object', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const doc = TextDocument.create(
      'foo://bar/valid.yaml',
      'yaml',
      0,
      specTemplate(
        '              targetSelectorType:\n                type: jsonpointer\n                version: rfc6901',
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test targetSelectorType is rejected on Arazzo 1.0 documents', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = `
arazzo: 1.0.1
info:
  title: Sample Arazzo Workflow
  version: 1.0.1
sourceDescriptions:
  - name: petStore
    type: openapi
    url: ./petstore-openapi.yaml
workflows:
  - workflowId: create-pet-workflow
    steps:
      - stepId: create-pet
        operationId: $sourceDescriptions.petStore.createPet
        requestBody:
          contentType: application/json
          replacements:
            - target: /name
              targetSelectorType: jsonpointer
              value: Fido
        successCriteria:
          - condition: $statusCode == 201
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.NOT_ALLOWED_FIELDS),
      `Expected NOT_ALLOWED_FIELDS error for targetSelectorType on a 1.0 document, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });
});
