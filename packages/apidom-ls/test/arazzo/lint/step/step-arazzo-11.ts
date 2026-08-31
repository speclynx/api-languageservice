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

// Base Arazzo 1.1 document with an AsyncAPI source description, parameterized by a single step.
const specTemplate = (step: string): string => `
arazzo: 1.1.0
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
${step}
`;

describe('test-arazzo-linting-step-arazzo-11', function () {
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

  it('test valid channelPath + action step produces no errors', async function () {
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
          '      - stepId: watch-pet',
          '        channelPath: $sourceDescriptions.petEvents.channels.petUpdated',
          '        action: receive',
          '        correlationId: $response.header.correlation-id',
          '        timeout: 5000',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_CHANNEL_PATH_TYPE', async function () {
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
          '      - stepId: watch-pet',
          '        channelPath: 42',
          '        action: receive',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_CHANNEL_PATH_TYPE),
      `Expected ARAZZO_STEP_FIELD_CHANNEL_PATH_TYPE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_CHANNEL_PATH_MUTUALLY_EXCLUSIVE', async function () {
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
          '      - stepId: watch-pet',
          '        operationId: $sourceDescriptions.petStore.getPetById',
          '        channelPath: $sourceDescriptions.petEvents.channels.petUpdated',
          '        action: receive',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_CHANNEL_PATH_MUTUALLY_EXCLUSIVE),
      `Expected ARAZZO_STEP_FIELD_CHANNEL_PATH_MUTUALLY_EXCLUSIVE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_TIMEOUT_TYPE', async function () {
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
          '      - stepId: get-pet',
          '        operationId: $sourceDescriptions.petStore.getPetById',
          '        timeout: 5.5',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_TIMEOUT_TYPE),
      `Expected ARAZZO_STEP_FIELD_TIMEOUT_TYPE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_ACTION_EQUALS', async function () {
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
          '      - stepId: watch-pet',
          '        channelPath: $sourceDescriptions.petEvents.channels.petUpdated',
          '        action: subscribe',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_ACTION_EQUALS),
      `Expected ARAZZO_STEP_FIELD_ACTION_EQUALS error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_CORRELATION_ID_ONLY_ACTION_RECEIVE', async function () {
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
          '      - stepId: publish-pet',
          '        channelPath: $sourceDescriptions.petEvents.channels.petUpdated',
          '        action: send',
          '        correlationId: $response.header.correlation-id',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_CORRELATION_ID_ONLY_ACTION_RECEIVE),
      `Expected ARAZZO_STEP_FIELD_CORRELATION_ID_ONLY_ACTION_RECEIVE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_DEPENDS_ON_TYPE', async function () {
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
          '      - stepId: get-pet',
          '        operationId: $sourceDescriptions.petStore.getPetById',
          '        dependsOn: not-an-array',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_DEPENDS_ON_TYPE),
      `Expected ARAZZO_STEP_FIELD_DEPENDS_ON_TYPE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_DEPENDS_ON_UNIQUE', async function () {
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
          '      - stepId: setup-pet',
          '        operationId: $sourceDescriptions.petStore.getPetById',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
          '      - stepId: get-pet',
          '        operationId: $sourceDescriptions.petStore.getPetById',
          '        dependsOn:',
          '          - setup-pet',
          '          - setup-pet',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_DEPENDS_ON_UNIQUE),
      `Expected ARAZZO_STEP_FIELD_DEPENDS_ON_UNIQUE error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_CORRELATION_ID_REQUIRES_ACTION', async function () {
    // correlationId present but `action` omitted entirely - distinct from the
    // ARAZZO_STEP_FIELD_CORRELATION_ID_ONLY_ACTION_RECEIVE case (action present, wrong value).
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
          '      - stepId: watch-pet',
          '        channelPath: $sourceDescriptions.petEvents.channels.petUpdated',
          '        correlationId: $response.header.correlation-id',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_CORRELATION_ID_REQUIRES_ACTION),
      `Expected ARAZZO_STEP_FIELD_CORRELATION_ID_REQUIRES_ACTION error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test 1.1-only step fields are rejected on Arazzo 1.0 documents', async function () {
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
        dependsOn: []
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.NOT_ALLOWED_FIELDS),
      `Expected NOT_ALLOWED_FIELDS error for dependsOn on a 1.0 document, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test an invalid 1.1-only field value on a 1.0 document is not double-flagged', async function () {
    // `dependsOn: []` above is trivially valid for the type/unique checks, so it can't tell us
    // whether those 1.1-only field-specific rules are also (incorrectly) scoped to fire on 1.0
    // docs. This uses an actually-invalid `action` value: on a 1.0 document it should get exactly
    // one diagnostic (NOT_ALLOWED_FIELDS, since `action` doesn't exist in 1.0 at all) - not that
    // plus a redundant ARAZZO_STEP_FIELD_ACTION_EQUALS from a field-specific rule that's still
    // scoped to both versions.
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
        action: not-a-real-action
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.NOT_ALLOWED_FIELDS),
      `Expected NOT_ALLOWED_FIELDS error for action on a 1.0 document, got: ${JSON.stringify(result)}`,
    );
    assert(
      result.every((d) => d.code !== codes.ARAZZO_STEP_FIELD_ACTION_EQUALS),
      `Expected no ARAZZO_STEP_FIELD_ACTION_EQUALS error on a 1.0 document (action is 1.1-only), got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test valid step dependsOn forms produce no errors', async function () {
    // Covers all three forms: a plain stepId in the current workflow, a $workflows. reference to
    // another workflow in this document, and a $sourceDescriptions. reference to an external one.
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = `
arazzo: 1.1.0
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
      - stepId: setup-pet
        operationId: $sourceDescriptions.petStore.getPetById
        successCriteria:
          - condition: $statusCode == 200
      - stepId: get-pet
        operationId: $sourceDescriptions.petStore.getPetById
        dependsOn:
          - setup-pet
          - $workflows.other-workflow.steps.other-step
          - $sourceDescriptions.externalArazzo.some-workflow.steps.some-step
        successCriteria:
          - condition: $statusCode == 200
  - workflowId: other-workflow
    steps:
      - stepId: other-step
        operationId: $sourceDescriptions.petStore.getPetById
`;
    const doc = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED', async function () {
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
          '      - stepId: get-pet',
          '        operationId: $sourceDescriptions.petStore.getPetById',
          '        dependsOn:',
          '          - does-not-exist',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED),
      `Expected ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test a step dependsOn entry referencing its own stepId is rejected', async function () {
    // A step can't depend on itself - `stepIds` must exclude the step declaring dependsOn.
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
          '      - stepId: get-pet',
          '        operationId: $sourceDescriptions.petStore.getPetById',
          '        dependsOn:',
          '          - get-pet',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED),
      `Expected ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test a step dependsOn entry cannot resolve to a step in a different workflow by plain stepId', async function () {
    // `other-step` only exists in `other-workflow`, not in the workflow that declares
    // dependsOn - it must be referenced via $workflows.other-workflow.steps.other-step instead.
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

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
          - other-step
        successCriteria:
          - condition: $statusCode == 200
  - workflowId: other-workflow
    steps:
      - stepId: other-step
        operationId: $sourceDescriptions.petStore.getPetById
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED),
      `Expected ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test a grammar-valid $sourceDescriptions. runtime expression missing the .steps.<id> shape is still rejected', async function () {
    // $sourceDescriptions.externalArazzo.some-workflow is a perfectly valid Runtime Expression on
    // its own (source-reference-id is an opaque 1*CHAR in the grammar), but dependsOn specifically
    // requires the <workflowId>.steps.<stepId> shape within that reference part.
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = `
arazzo: 1.1.0
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
        dependsOn:
          - $sourceDescriptions.externalArazzo.some-workflow
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED),
      `Expected ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test a $sourceDescriptions. dependsOn reference with a dotted workflowId is flagged (grammar limitation)', async function () {
    // workflowId's own field pattern is only a spec SHOULD, not a MUST, so "a.b" is technically a
    // legal (if unconventional) workflowId - but @swaggerexpert/arazzo-runtime-expression's
    // workflow-id production is `identifier-strict`, which excludes dots, so it does not
    // recognize this as a steps reference (a documented, accepted limitation upstream, since the
    // dependsOn convention has no formal grammar of its own to fall back on). This rule defers
    // entirely to that shared parser rather than a more lenient local heuristic, so it stays
    // consistent with whatever any other consumer of the same library would also resolve.
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = `
arazzo: 1.1.0
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
        dependsOn:
          - $sourceDescriptions.externalArazzo.a.b.steps.some-step
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED),
      `Expected ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test a $workflows. dependsOn reference pointing at outputs (not steps) is rejected', async function () {
    // $workflows.<id>.outputs.<name> is a valid WorkflowsExpression, but dependsOn specifically
    // needs a WorkflowsStepsExpression ($workflows.<id>.steps.<id>) - using the value-reference
    // shape here should not be silently accepted.
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
          '      - stepId: get-pet',
          '        operationId: $sourceDescriptions.petStore.getPetById',
          '        dependsOn:',
          '          - $workflows.other-workflow.outputs.someOutput',
          '        successCriteria:',
          '          - condition: $statusCode == 200',
        ].join('\n'),
      ),
    );

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED),
      `Expected ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });
});
