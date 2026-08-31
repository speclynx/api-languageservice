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

const specTemplate = (self: string): string => `
arazzo: 1.1.0
${self}
info:
  title: Sample Arazzo Workflow
  version: 1.0.1
sourceDescriptions:
  - name: petStore
    type: openapi
    url: ./petstore-openapi.yaml
workflows:
  - workflowId: get-pet-workflow
    steps:
      - stepId: get-pet
        operationId: $sourceDescriptions.petStore.getPetById
        successCriteria:
          - condition: $statusCode == 200
`;

describe('test-arazzo-linting-arazzoSpecification1-self', function () {
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

  it('test $self is a valid URI-reference produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const doc = TextDocument.create(
      'foo://bar/valid.yaml',
      'yaml',
      0,
      specTemplate('$self: https://example.com/arazzo/pet-workflow.yaml'),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test ARAZZO_SPEC_FIELD_$SELF_TYPE', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, specTemplate('$self: 42'));

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_SPEC_FIELD_$SELF_TYPE),
      `Expected ARAZZO_SPEC_FIELD_$SELF_TYPE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_SPEC_FIELD_$SELF_NO_FRAGMENT', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const doc = TextDocument.create(
      'foo://bar/invalid.yaml',
      'yaml',
      0,
      specTemplate('$self: https://example.com/arazzo/pet-workflow.yaml#section'),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_SPEC_FIELD_$SELF_NO_FRAGMENT),
      `Expected ARAZZO_SPEC_FIELD_$SELF_NO_FRAGMENT error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test $self is rejected on Arazzo 1.0 documents', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = `
arazzo: 1.0.1
$self: https://example.com/arazzo/pet-workflow.yaml
info:
  title: Sample Arazzo Workflow
  version: 1.0.1
sourceDescriptions:
  - name: petStore
    type: openapi
    url: ./petstore-openapi.yaml
workflows:
  - workflowId: get-pet-workflow
    steps:
      - stepId: get-pet
        operationId: $sourceDescriptions.petStore.getPetById
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.NOT_ALLOWED_FIELDS),
      `Expected NOT_ALLOWED_FIELDS error for $self on a 1.0 document, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });
});
