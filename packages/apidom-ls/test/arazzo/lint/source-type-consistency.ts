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

describe('test-arazzo-linting-source-type-consistency', function () {
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

  const validationContext: ValidationContext = {
    comments: DiagnosticSeverity.Error,
    maxNumberOfProblems: 100,
    relatedInformation: false,
  };

  it('test ARAZZO_STEP_FIELD_OPERATION_ID_SOURCE_TYPE', async function () {
    const spec = `
arazzo: 1.0.1
info:
  title: Sample Arazzo Workflow
  version: 1.0.0
sourceDescriptions:
  - name: externalArazzo
    type: arazzo
    url: ./external-arazzo.yaml
workflows:
  - workflowId: get-pet-workflow
    steps:
      - stepId: get-pet
        operationId: $sourceDescriptions.externalArazzo.getPetById
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_OPERATION_ID_SOURCE_TYPE),
      `Expected ARAZZO_STEP_FIELD_OPERATION_ID_SOURCE_TYPE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_WORKFLOW_ID_SOURCE_TYPE', async function () {
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
        workflowId: $sourceDescriptions.petStore.someWorkflow
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_WORKFLOW_ID_SOURCE_TYPE),
      `Expected ARAZZO_STEP_FIELD_WORKFLOW_ID_SOURCE_TYPE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_SOURCE_TYPE', async function () {
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
        onSuccess:
          - name: gotoAction
            type: goto
            workflowId: $sourceDescriptions.petStore.someWorkflow
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_SOURCE_TYPE),
      `Expected ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_SOURCE_TYPE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_FAILURE_ACTION_FIELD_WORKFLOW_ID_SOURCE_TYPE', async function () {
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
            workflowId: $sourceDescriptions.petStore.someWorkflow
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_FAILURE_ACTION_FIELD_WORKFLOW_ID_SOURCE_TYPE),
      `Expected ARAZZO_FAILURE_ACTION_FIELD_WORKFLOW_ID_SOURCE_TYPE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_WORKFLOW_FIELD_DEPENDS_ON_SOURCE_TYPE', async function () {
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
    dependsOn:
      - $sourceDescriptions.petStore.someWorkflow
    steps:
      - stepId: get-pet
        operationId: $sourceDescriptions.petStore.getPetById
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_WORKFLOW_FIELD_DEPENDS_ON_SOURCE_TYPE),
      `Expected ARAZZO_WORKFLOW_FIELD_DEPENDS_ON_SOURCE_TYPE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_DEPENDS_ON_SOURCE_TYPE', async function () {
    const spec = `
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
        dependsOn:
          - $sourceDescriptions.petStore.someWorkflow.steps.someStep
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_DEPENDS_ON_SOURCE_TYPE),
      `Expected ARAZZO_STEP_FIELD_DEPENDS_ON_SOURCE_TYPE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test the check is skipped when the sourceDescription omits type', async function () {
    // `type` is optional per spec - with no local signal, the check must not guess.
    const spec = `
arazzo: 1.0.1
info:
  title: Sample Arazzo Workflow
  version: 1.0.0
sourceDescriptions:
  - name: untyped
    url: ./untyped.yaml
workflows:
  - workflowId: get-pet-workflow
    steps:
      - stepId: get-pet
        workflowId: $sourceDescriptions.untyped.someWorkflow
`;
    const doc = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.every((d) => d.code !== codes.ARAZZO_STEP_FIELD_WORKFLOW_ID_SOURCE_TYPE),
      `Expected no ARAZZO_STEP_FIELD_WORKFLOW_ID_SOURCE_TYPE errors, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test a matching source type produces no errors', async function () {
    const spec = `
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
      - stepId: run-other-workflow
        workflowId: $sourceDescriptions.externalArazzo.someWorkflow
`;
    const doc = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.every(
        (d) =>
          d.code !== codes.ARAZZO_STEP_FIELD_OPERATION_ID_SOURCE_TYPE &&
          d.code !== codes.ARAZZO_STEP_FIELD_WORKFLOW_ID_SOURCE_TYPE,
      ),
      `Expected no source-type-consistency errors, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });
});
