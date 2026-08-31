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

// `Arazzo`/`Arazzo1` include the `1.0.x`/`1.1.x` wildcard target-specs alongside the enumerated
// exact versions, so the whole Arazzo ruleset keeps validating documents on a not-yet-enumerated
// patch version (e.g. a hypothetical 1.1.1) rather than going dark.
describe('test-arazzo-target-specs-wildcard', function () {
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

  it('test rules still fire for an unenumerated 1.1.x patch version', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = `
arazzo: 1.1.1
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
      - operationId: $sourceDescriptions.petStore.getPetById
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_STEP_ID_REQUIRED),
      `Expected ARAZZO_STEP_FIELD_STEP_ID_REQUIRED error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test a version-split -1-1.ts rule still fires for an unenumerated 1.1.x patch version', async function () {
    // step/lint/action--equals.ts is targetSpecs: Arazzo11, not the generic Arazzo aggregate -
    // this specifically exercises that Arazzo11 itself (not just the top-level Arazzo aggregate)
    // includes the 1.1.x wildcard.
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = `
arazzo: 1.1.1
info:
  title: Sample Arazzo Workflow
  version: 1.0.0
sourceDescriptions:
  - name: petEvents
    type: asyncapi
    url: ./pet-events-asyncapi.yaml
workflows:
  - workflowId: get-pet-workflow
    steps:
      - stepId: watch-pet
        channelPath: $sourceDescriptions.petEvents.channels.petUpdated
        action: not-a-real-action
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_STEP_FIELD_ACTION_EQUALS),
      `Expected ARAZZO_STEP_FIELD_ACTION_EQUALS error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test a version-split -1-0.ts rule still fires for an unenumerated 1.0.x patch version', async function () {
    // step/lint/allowed-fields-1-0.ts is targetSpecs: Arazzo10 - this exercises that Arazzo10
    // itself includes the 1.0.x wildcard, not just the top-level Arazzo aggregate.
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = `
arazzo: 1.0.2
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
        action: receive
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.NOT_ALLOWED_FIELDS),
      `Expected NOT_ALLOWED_FIELDS error for action on a 1.0.2 document, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });
});
