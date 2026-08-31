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

// Base doc parameterized by a single onSuccess action, exercising the `workflowId` reference
// field shared by step/successAction/failureAction (they all reuse the same regex/guard).
const specTemplate = (onSuccess: string): string => `
arazzo: 1.0.1
info:
  title: Sample Arazzo Workflow
  version: 1.0.0
sourceDescriptions:
  - name: petStore
    type: openapi
    url: ./petstore-openapi.yaml
  - name: externalArazzo
    type: arazzo
    url: ./external-arazzo.yaml
workflows:
  - workflowId: get-pet-workflow
    steps:
      - stepId: get-pet
        operationId: $sourceDescriptions.petStore.getPetById
        successCriteria:
          - condition: $statusCode == 200
        onSuccess:
${onSuccess}
  - workflowId: other-workflow
    steps:
      - stepId: noop
        operationId: $sourceDescriptions.petStore.getPetById
`;

describe('test-arazzo-linting-workflow-id-pattern', function () {
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

  it('test ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_PATTERN', async function () {
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
          '          - name: gotoAction',
          '            type: goto',
          '            workflowId: not a valid id',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const diagnostic = result.find(
      (d) => d.code === codes.ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_PATTERN,
    );
    assert(
      diagnostic,
      `Expected ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_PATTERN, got: ${JSON.stringify(result)}`,
    );
    assert.strictEqual(
      diagnostic!.severity,
      DiagnosticSeverity.Warning,
      'workflowId pattern is a spec SHOULD, not a MUST - it must be a Warning, not an Error',
    );

    languageService.terminate();
  });

  it('test a $sourceDescriptions. runtime expression is not flagged by the workflowId pattern check', async function () {
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
          '          - name: gotoAction',
          '            type: goto',
          '            workflowId: $sourceDescriptions.externalArazzo.external-workflow',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.every((d) => d.code !== codes.ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_PATTERN),
      `Expected no ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_PATTERN errors, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_FAILURE_ACTION_FIELD_WORKFLOW_ID_PATTERN', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = `
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
        onFailure:
          - name: gotoAction
            type: goto
            workflowId: not a valid id
  - workflowId: other-workflow
    steps:
      - stepId: noop
        operationId: $sourceDescriptions.petStore.getPetById
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const diagnostic = result.find(
      (d) => d.code === codes.ARAZZO_FAILURE_ACTION_FIELD_WORKFLOW_ID_PATTERN,
    );
    assert(
      diagnostic,
      `Expected ARAZZO_FAILURE_ACTION_FIELD_WORKFLOW_ID_PATTERN, got: ${JSON.stringify(result)}`,
    );
    assert.strictEqual(
      diagnostic!.severity,
      DiagnosticSeverity.Warning,
      'workflowId pattern is a spec SHOULD, not a MUST - it must be a Warning, not an Error',
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_WORKFLOW_ID_PATTERN', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = `
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
        workflowId: not a valid id
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const diagnostic = result.find((d) => d.code === codes.ARAZZO_STEP_FIELD_WORKFLOW_ID_PATTERN);
    assert(
      diagnostic,
      `Expected ARAZZO_STEP_FIELD_WORKFLOW_ID_PATTERN, got: ${JSON.stringify(result)}`,
    );
    assert.strictEqual(
      diagnostic!.severity,
      DiagnosticSeverity.Warning,
      'workflowId pattern is a spec SHOULD, not a MUST - it must be a Warning, not an Error',
    );

    languageService.terminate();
  });
});
