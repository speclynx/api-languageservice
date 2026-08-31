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

// Selector Objects (Arazzo 1.1) are only structurally recognized by apidom when all three
// required fields (context, selector, type) are present (OAI/Arazzo-Specification#519);
// otherwise the value falls back to a plain object/Reusable-shaped element.
const specTemplate = (output: string): string => `
arazzo: 1.1.0
info:
  title: Sample Arazzo Workflow
  version: 1.0.0
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
        outputs:
${output}
`;

describe('test-arazzo-linting-selector', function () {
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

  it('test a valid Selector Object as a step output produces no errors', async function () {
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
        [
          '          petName:',
          '            context: $response.body',
          '            selector: $.name',
          '            type: jsonpath',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test an object missing one Selector field is not flagged as an incomplete selector', async function () {
    // apidom only disambiguates an object as a `selector` element once `context`, `selector`
    // and `type` are ALL present (OAI/Arazzo-Specification#519); with `context` missing here it
    // simply isn't parsed as `selector`, so none of the selector-specific rules should fire.
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const doc = TextDocument.create(
      'foo://bar/incomplete.yaml',
      'yaml',
      0,
      specTemplate(
        ['          petName:', '            selector: $.name', '            type: jsonpath'].join(
          '\n',
        ),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.every((d) => typeof d.code !== 'number' || d.code < 9150000 || d.code >= 9160000),
      `Expected no ARAZZO_SELECTOR_* diagnostics, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_SELECTOR_FIELD_TYPE_EQUALS', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const doc = TextDocument.create(
      'foo://bar/invalid.yaml',
      'yaml',
      0,
      specTemplate(
        [
          '          petName:',
          '            context: $response.body',
          '            selector: $.name',
          '            type: not-a-real-type',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_SELECTOR_FIELD_TYPE_EQUALS),
      `Expected ARAZZO_SELECTOR_FIELD_TYPE_EQUALS error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test Selector Object with an Expression Type Object produces no errors', async function () {
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
        [
          '          petName:',
          '            context: $response.body',
          '            selector: /name',
          '            type:',
          '              type: jsonpointer',
          '              version: rfc6901',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE still fires in Arazzo 1.1 for non-string, non-Selector values', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const doc = TextDocument.create(
      'foo://bar/invalid.yaml',
      'yaml',
      0,
      specTemplate(['          petName: 42'].join('\n')),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE),
      `Expected ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });
});
