import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import { fileURLToPath } from 'node:url';

import getLanguageService from '../../../../src/apidom-language-service.ts';
import {
  LanguageService,
  LanguageServiceContext,
  ValidationContext,
} from '../../../../src/apidom-language-types.ts';
import { metadata } from './../../../metadata.ts';
import { logPerformance, logLevel } from './../../../test-utils.ts';
import codes from '../../../../src/config/codes.ts';

const fixturesDir = fileURLToPath(new URL('../../../fixtures', import.meta.url));

describe('test-arazzo-linting-expressionType', function () {
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

  it('test ARAZZO_EXPRESSION_TYPE_FIELD_TYPE_REQUIRED', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const specInvalid = fs
      .readFileSync(
        path.join(
          fixturesDir,
          'arazzo',
          'expressionType',
          'ARAZZO_EXPRESSION_TYPE_FIELD_TYPE_REQUIRED',
          'arazzo-invalid.yaml',
        ),
      )
      .toString();
    const docInvalid = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, specInvalid);

    const specValid = fs
      .readFileSync(
        path.join(
          fixturesDir,
          'arazzo',
          'expressionType',
          'ARAZZO_EXPRESSION_TYPE_FIELD_TYPE_REQUIRED',
          'arazzo-valid.yaml',
        ),
      )
      .toString();
    const docValid = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, specValid);

    const languageService: LanguageService = getLanguageService(context);

    // This exercises the element previously known as `criterionExpressionType`, which was
    // renamed to `expressionType` by apidom-ns-arazzo-1 (Arazzo 1.1). If the metadata map key
    // and this rule's element target ever drift apart again, these rules silently stop firing.
    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    const invalidErrors = resultInvalid.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.isAtLeast(
      invalidErrors.length,
      1,
      `Expected at least one error but got none: ${JSON.stringify(resultInvalid)}`,
    );
    assert(invalidErrors.some((d) => d.code === codes.ARAZZO_EXPRESSION_TYPE_FIELD_TYPE_REQUIRED));

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const validErrors = resultValid.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(
      validErrors.length,
      0,
      `Expected no errors but got: ${JSON.stringify(validErrors)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_EXPRESSION_TYPE_FIELD_TYPE_EQUALS', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const specInvalid = fs
      .readFileSync(
        path.join(
          fixturesDir,
          'arazzo',
          'expressionType',
          'ARAZZO_EXPRESSION_TYPE_FIELD_TYPE_EQUALS',
          'arazzo-invalid.yaml',
        ),
      )
      .toString();
    const docInvalid = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, specInvalid);

    const specValid = fs
      .readFileSync(
        path.join(
          fixturesDir,
          'arazzo',
          'expressionType',
          'ARAZZO_EXPRESSION_TYPE_FIELD_TYPE_EQUALS',
          'arazzo-valid.yaml',
        ),
      )
      .toString();
    const docValid = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, specValid);

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    const invalidErrors = resultInvalid.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.isAtLeast(
      invalidErrors.length,
      1,
      `Expected at least one error but got none: ${JSON.stringify(resultInvalid)}`,
    );
    assert(invalidErrors.some((d) => d.code === codes.ARAZZO_EXPRESSION_TYPE_FIELD_TYPE_EQUALS));

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const validErrors = resultValid.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(
      validErrors.length,
      0,
      `Expected no errors but got: ${JSON.stringify(validErrors)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_REQUIRED still fires on Arazzo 1.0', async function () {
    // Arazzo 1.0's official schema unconditionally requires `version` on expressionType.
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = `
arazzo: 1.0.0
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
            context: $response.body
            type:
              type: xpath
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_REQUIRED),
      `Expected ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_REQUIRED error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_REQUIRED no longer fires on Arazzo 1.1', async function () {
    // Arazzo 1.1's spec description makes `version` optional ("a default value is assumed
    // based on the expression type"), even though the vendored 1.1 schema still lists it as
    // required - this rule intentionally follows the description, not the schema, for 1.1.
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
        successCriteria:
          - condition: $statusCode == 200
            context: $response.body
            type:
              type: jsonpointer
`;
    const doc = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert.isFalse(
      result.some((d) => d.code === codes.ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_REQUIRED),
      `Expected no ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_REQUIRED error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });

  it('test jsonpointer is a valid expression type (Arazzo 1.1)', async function () {
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
        successCriteria:
          - condition: $statusCode == 200
            context: $response.body
            type:
              type: jsonpointer
              version: rfc6901
`;
    const doc = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_EQUALS_JSONPATH', async function () {
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
        successCriteria:
          - condition: $statusCode == 200
            context: $response.body
            type:
              type: jsonpath
              version: xpath-30
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert(
      errors.some((d) => d.code === codes.ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_EQUALS_JSONPATH),
    );

    languageService.terminate();
  });

  it('test jsonpointer is not a valid expression type on Arazzo 1.0', async function () {
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
            context: $response.body
            type:
              type: jsonpointer
              version: rfc6901
`;
    const doc = TextDocument.create('foo://bar/invalid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);
    const result = await languageService.doValidation(doc, validationContext);
    assert(
      result.some((d) => d.code === codes.ARAZZO_EXPRESSION_TYPE_FIELD_TYPE_EQUALS),
      `Expected ARAZZO_EXPRESSION_TYPE_FIELD_TYPE_EQUALS error, got: ${JSON.stringify(result)}`,
    );

    languageService.terminate();
  });
});
