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

// The pattern checks on workflow.workflowId, step.stepId and sourceDescription.name were
// downgraded from Error to Warning severity (the spec says these fields SHOULD, not MUST, match
// [A-Za-z0-9_-]+). This file asserts that severity directly, since none of the pre-existing tests
// for these three rules checked it.
describe('test-arazzo-linting-definition-pattern-severity', function () {
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

  it('test ARAZZO_WORKFLOW_FIELD_WORKFLOW_ID_PATTERN is a Warning', async function () {
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
  - workflowId: not a valid id
    steps:
      - stepId: get-pet
        operationId: $sourceDescriptions.petStore.getPetById
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const diagnostic = result.find(
      (d) => d.code === codes.ARAZZO_WORKFLOW_FIELD_WORKFLOW_ID_PATTERN,
    );
    assert(
      diagnostic,
      `Expected ARAZZO_WORKFLOW_FIELD_WORKFLOW_ID_PATTERN, got: ${JSON.stringify(result)}`,
    );
    assert.strictEqual(diagnostic!.severity, DiagnosticSeverity.Warning);

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_STEP_ID_PATTERN is a Warning', async function () {
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
      - stepId: not a valid id
        operationId: $sourceDescriptions.petStore.getPetById
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const diagnostic = result.find((d) => d.code === codes.ARAZZO_STEP_FIELD_STEP_ID_PATTERN);
    assert(
      diagnostic,
      `Expected ARAZZO_STEP_FIELD_STEP_ID_PATTERN, got: ${JSON.stringify(result)}`,
    );
    assert.strictEqual(diagnostic!.severity, DiagnosticSeverity.Warning);

    languageService.terminate();
  });

  it('test ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_PATTERN is a Warning', async function () {
    const spec = `
arazzo: 1.0.1
info:
  title: Sample Arazzo Workflow
  version: 1.0.0
sourceDescriptions:
  - name: not a valid name
    type: openapi
    url: ./petstore-openapi.yaml
workflows:
  - workflowId: get-pet-workflow
    steps:
      - stepId: get-pet
        operationId: getPetById
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const diagnostic = result.find(
      (d) => d.code === codes.ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_PATTERN,
    );
    assert(
      diagnostic,
      `Expected ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_PATTERN, got: ${JSON.stringify(result)}`,
    );
    assert.strictEqual(diagnostic!.severity, DiagnosticSeverity.Warning);

    languageService.terminate();
  });
});
