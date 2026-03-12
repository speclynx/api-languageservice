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

describe('test-arazzo-linting-comprehensive', function () {
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

  it('valid comprehensive document produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = fs
      .readFileSync(path.join(fixturesDir, 'arazzo', 'comprehensive', 'arazzo-valid.yaml'))
      .toString();

    const doc: TextDocument = TextDocument.create('foo://bar/arazzo-valid.yaml', 'yaml', 0, spec);

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(doc, validationContext);
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert(errors.length === 0, `Expected no errors but got ${errors.length}: ${JSON.stringify(errors.map((e) => ({ code: e.code, message: e.message })))}`);

    languageService.terminate();
  });

  it('invalid comprehensive document produces multiple errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const spec = fs
      .readFileSync(path.join(fixturesDir, 'arazzo', 'comprehensive', 'arazzo-invalid.yaml'))
      .toString();

    const doc: TextDocument = TextDocument.create(
      'foo://bar/arazzo-invalid.yaml',
      'yaml',
      0,
      spec,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(doc, validationContext);
    const errorCodes = result.map((d) => d.code);

    // Verify errors from multiple object types are detected
    assert(
      errorCodes.includes(codes.ARAZZO_INFO_FIELD_TITLE_REQUIRED),
      'Expected ARAZZO_INFO_FIELD_TITLE_REQUIRED',
    );
    assert(
      errorCodes.includes(codes.ARAZZO_INFO_FIELD_VERSION_REQUIRED),
      'Expected ARAZZO_INFO_FIELD_VERSION_REQUIRED',
    );
    assert(
      errorCodes.includes(codes.ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_REQUIRED),
      'Expected ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_REQUIRED',
    );
    assert(
      errorCodes.includes(codes.ARAZZO_WORKFLOW_FIELD_WORKFLOW_ID_REQUIRED),
      'Expected ARAZZO_WORKFLOW_FIELD_WORKFLOW_ID_REQUIRED',
    );
    assert(
      errorCodes.includes(codes.ARAZZO_STEP_FIELD_STEP_ID_REQUIRED),
      'Expected ARAZZO_STEP_FIELD_STEP_ID_REQUIRED',
    );
    assert(
      errorCodes.includes(codes.ARAZZO_PARAMETER_FIELD_NAME_REQUIRED),
      'Expected ARAZZO_PARAMETER_FIELD_NAME_REQUIRED',
    );
    assert(
      errorCodes.includes(codes.ARAZZO_SUCCESS_ACTION_FIELD_NAME_REQUIRED),
      'Expected ARAZZO_SUCCESS_ACTION_FIELD_NAME_REQUIRED',
    );
    assert(
      errorCodes.includes(codes.ARAZZO_FAILURE_ACTION_FIELD_NAME_REQUIRED),
      'Expected ARAZZO_FAILURE_ACTION_FIELD_NAME_REQUIRED',
    );
    assert(
      errorCodes.includes(codes.ARAZZO_PAYLOAD_REPLACEMENT_FIELD_TARGET_REQUIRED),
      'Expected ARAZZO_PAYLOAD_REPLACEMENT_FIELD_TARGET_REQUIRED',
    );
    assert(
      errorCodes.includes(codes.ARAZZO_CRITERION_FIELD_CONDITION_REQUIRED),
      'Expected ARAZZO_CRITERION_FIELD_CONDITION_REQUIRED',
    );

    // Verify JSON Schema errors
    assert(errorCodes.includes(codes.SCHEMA_TYPE), 'Expected SCHEMA_TYPE');

    languageService.terminate();
  });
});
