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

describe('test-arazzo-linting-sourceDescription-asyncapi', function () {
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

  it('test sourceDescriptions type: asyncapi is valid in Arazzo 1.1', async function () {
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
  - name: petEvents
    type: asyncapi
    url: ./pet-events-asyncapi.yaml
workflows:
  - workflowId: get-pet-workflow
    steps:
      - stepId: watch-pet
        channelPath: $sourceDescriptions.petEvents.channels.petUpdated
        action: receive
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test sourceDescriptions type: asyncapi is rejected in Arazzo 1.0', async function () {
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
  - name: petEvents
    type: asyncapi
    url: ./pet-events-asyncapi.yaml
workflows:
  - workflowId: get-pet-workflow
    steps:
      - stepId: get-pet
        operationId: $sourceDescriptions.petEvents.getPetById
        successCriteria:
          - condition: $statusCode == 200
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_EQUALS),
      `Expected ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_EQUALS error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });
});
