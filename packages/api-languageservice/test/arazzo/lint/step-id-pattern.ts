import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity } from 'vscode-languageserver-types';

import getLanguageService from '../../../src/apidom-language-service.ts';
import {
  LanguageService,
  LanguageServiceContext,
  ValidationContext,
} from '../../../src/apidom-language-types.ts';
import { metadata } from './../../metadata.ts';
import { logPerformance, logLevel } from './../../test-utils.ts';
import codes from '../../../src/config/codes.ts';

// Base doc parameterized by a single onSuccess/onFailure action's stepId, exercising the stepId
// reference field shared by successAction/failureAction. Unlike workflowId, stepId is always
// local (no $sourceDescriptions. form), so no $-guard is needed.
const specTemplate = (actionsKey: string, action: string): string => `
arazzo: 1.0.1
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
        ${actionsKey}:
${action}
`;

describe('test-arazzo-linting-step-id-pattern', function () {
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

  it('test ARAZZO_SUCCESS_ACTION_FIELD_STEP_ID_PATTERN', async function () {
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
        'onSuccess',
        [
          '          - name: gotoAction',
          '            type: goto',
          '            stepId: not a valid id',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const diagnostic = result.find(
      (d) => d.code === codes.ARAZZO_SUCCESS_ACTION_FIELD_STEP_ID_PATTERN,
    );
    assert(
      diagnostic,
      `Expected ARAZZO_SUCCESS_ACTION_FIELD_STEP_ID_PATTERN, got: ${JSON.stringify(result)}`,
    );
    assert.strictEqual(
      diagnostic!.severity,
      DiagnosticSeverity.Warning,
      'stepId pattern is a spec SHOULD, not a MUST - it must be a Warning, not an Error',
    );

    languageService.terminate();
  });

  it('test ARAZZO_FAILURE_ACTION_FIELD_STEP_ID_PATTERN', async function () {
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
        'onFailure',
        [
          '          - name: gotoAction',
          '            type: goto',
          '            stepId: not a valid id',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const diagnostic = result.find(
      (d) => d.code === codes.ARAZZO_FAILURE_ACTION_FIELD_STEP_ID_PATTERN,
    );
    assert(
      diagnostic,
      `Expected ARAZZO_FAILURE_ACTION_FIELD_STEP_ID_PATTERN, got: ${JSON.stringify(result)}`,
    );
    assert.strictEqual(
      diagnostic!.severity,
      DiagnosticSeverity.Warning,
      'stepId pattern is a spec SHOULD, not a MUST - it must be a Warning, not an Error',
    );

    languageService.terminate();
  });
});
