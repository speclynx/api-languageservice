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

const specTemplate = (onFailure: string): string => `
arazzo: 1.1.0
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
        onFailure:
${onFailure}
  - workflowId: other-workflow
    steps:
      - stepId: noop
        operationId: $sourceDescriptions.petStore.getPetById
`;

describe('test-arazzo-linting-failureAction-parameters', function () {
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

  it('test ARAZZO_FAILURE_ACTION_FIELD_PARAMETERS_ONLY_WORKFLOW_ID', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docInvalid = TextDocument.create(
      'foo://bar/invalid.yaml',
      'yaml',
      0,
      specTemplate(
        [
          '          - name: gotoAction',
          '            type: goto',
          '            stepId: get-pet',
          '            parameters:',
          '              - name: petId',
          '                value: 1',
        ].join('\n'),
      ),
    );
    const docValid = TextDocument.create(
      'foo://bar/valid.yaml',
      'yaml',
      0,
      specTemplate(
        [
          '          - name: gotoAction',
          '            type: goto',
          '            workflowId: other-workflow',
          '            parameters:',
          '              - name: petId',
          '                value: 1',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    assert(
      resultInvalid.some(
        (d) => d.code === codes.ARAZZO_FAILURE_ACTION_FIELD_PARAMETERS_ONLY_WORKFLOW_ID,
      ),
      `Expected ARAZZO_FAILURE_ACTION_FIELD_PARAMETERS_ONLY_WORKFLOW_ID warning, got: ${JSON.stringify(resultInvalid)}`,
    );

    const resultValid = await languageService.doValidation(docValid, validationContext);
    assert(
      resultValid.every(
        (d) => d.code !== codes.ARAZZO_FAILURE_ACTION_FIELD_PARAMETERS_ONLY_WORKFLOW_ID,
      ),
      `Expected no ARAZZO_FAILURE_ACTION_FIELD_PARAMETERS_ONLY_WORKFLOW_ID warnings, got: ${JSON.stringify(resultValid)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_FAILURE_ACTION_FIELD_PARAMETERS_TYPE', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docInvalid = TextDocument.create(
      'foo://bar/invalid.yaml',
      'yaml',
      0,
      specTemplate(
        [
          '          - name: gotoAction',
          '            type: goto',
          '            workflowId: other-workflow',
          '            parameters: not-an-array',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    assert(
      resultInvalid.some((d) => d.code === codes.ARAZZO_FAILURE_ACTION_FIELD_PARAMETERS_TYPE),
      `Expected ARAZZO_FAILURE_ACTION_FIELD_PARAMETERS_TYPE error, got: ${JSON.stringify(resultInvalid)}`,
    );

    languageService.terminate();
  });

  it('test parameters is rejected on a failureAction in an Arazzo 1.0 document', async function () {
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
  - workflowId: get-pet-workflow
    steps:
      - stepId: get-pet
        operationId: $sourceDescriptions.petStore.getPetById
        successCriteria:
          - condition: $statusCode == 200
        onFailure:
          - name: gotoAction
            type: goto
            workflowId: other-workflow
            parameters:
              - name: petId
                value: 1
  - workflowId: other-workflow
    steps:
      - stepId: noop
        operationId: $sourceDescriptions.petStore.getPetById
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.NOT_ALLOWED_FIELDS),
      `Expected NOT_ALLOWED_FIELDS error for parameters on a 1.0 document, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });
});
