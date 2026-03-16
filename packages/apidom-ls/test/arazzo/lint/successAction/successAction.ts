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

describe('test-arazzo-linting-successAction', function () {
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

  it('test ARAZZO_SUCCESS_ACTION_FIELD_NAME_REQUIRED', async function () {
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
          'successAction',
          'ARAZZO_SUCCESS_ACTION_FIELD_NAME_REQUIRED',
          'arazzo-invalid.yaml',
        ),
      )
      .toString();

    const docInvalid: TextDocument = TextDocument.create(
      'foo://bar/arazzo-invalid.yaml',
      'yaml',
      0,
      specInvalid,
    );

    const specValid = fs
      .readFileSync(
        path.join(
          fixturesDir,
          'arazzo',
          'successAction',
          'ARAZZO_SUCCESS_ACTION_FIELD_NAME_REQUIRED',
          'arazzo-valid.yaml',
        ),
      )
      .toString();

    const docValid: TextDocument = TextDocument.create(
      'foo://bar/arazzo-valid.yaml',
      'yaml',
      0,
      specValid,
    );

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    // Should produce at least one error for ARAZZO_SUCCESS_ACTION_FIELD_NAME_REQUIRED
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_SUCCESS_ACTION_FIELD_NAME_REQUIRED);

    const resultValid = await languageService.doValidation(docValid, validationContext);

    // Should produce no error for ARAZZO_SUCCESS_ACTION_FIELD_NAME_REQUIRED
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_SUCCESS_ACTION_FIELD_TYPE_REQUIRED', async function () {
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
          'successAction',
          'ARAZZO_SUCCESS_ACTION_FIELD_TYPE_REQUIRED',
          'arazzo-invalid.yaml',
        ),
      )
      .toString();

    const docInvalid: TextDocument = TextDocument.create(
      'foo://bar/arazzo-invalid.yaml',
      'yaml',
      0,
      specInvalid,
    );

    const specValid = fs
      .readFileSync(
        path.join(
          fixturesDir,
          'arazzo',
          'successAction',
          'ARAZZO_SUCCESS_ACTION_FIELD_TYPE_REQUIRED',
          'arazzo-valid.yaml',
        ),
      )
      .toString();

    const docValid: TextDocument = TextDocument.create(
      'foo://bar/arazzo-valid.yaml',
      'yaml',
      0,
      specValid,
    );

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    // Should produce at least one error for ARAZZO_SUCCESS_ACTION_FIELD_TYPE_REQUIRED
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_SUCCESS_ACTION_FIELD_TYPE_REQUIRED);

    const resultValid = await languageService.doValidation(docValid, validationContext);

    // Should produce no error for ARAZZO_SUCCESS_ACTION_FIELD_TYPE_REQUIRED
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_MUTUALLY_EXCLUSIVE', async function () {
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
          'successAction',
          'ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_MUTUALLY_EXCLUSIVE',
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
          'successAction',
          'ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_MUTUALLY_EXCLUSIVE',
          'arazzo-valid.yaml',
        ),
      )
      .toString();
    const docValid = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, specValid);

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    const errors = resultInvalid.filter(
      (d) =>
        d.code === codes.ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_MUTUALLY_EXCLUSIVE ||
        d.code === codes.ARAZZO_SUCCESS_ACTION_FIELD_STEP_ID_MUTUALLY_EXCLUSIVE,
    );
    assert(errors.length > 0, 'Expected mutual exclusivity error for workflowId and stepId');

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const validErrors = resultValid.filter(
      (d) =>
        d.code === codes.ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_MUTUALLY_EXCLUSIVE ||
        d.code === codes.ARAZZO_SUCCESS_ACTION_FIELD_STEP_ID_MUTUALLY_EXCLUSIVE,
    );
    assert(validErrors.length === 0, 'Expected no mutual exclusivity errors');

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_SUCCESS_ACTIONS_NAMES_UNIQUE', async function () {
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
          'successAction',
          'ARAZZO_STEP_FIELD_SUCCESS_ACTIONS_NAMES_UNIQUE',
          'arazzo-invalid.yaml',
        ),
      )
      .toString();
    const docInvalid: TextDocument = TextDocument.create(
      'foo://bar/arazzo-invalid.yaml',
      'yaml',
      0,
      specInvalid,
    );

    const specValid = fs
      .readFileSync(
        path.join(
          fixturesDir,
          'arazzo',
          'successAction',
          'ARAZZO_STEP_FIELD_SUCCESS_ACTIONS_NAMES_UNIQUE',
          'arazzo-valid.yaml',
        ),
      )
      .toString();
    const docValid: TextDocument = TextDocument.create(
      'foo://bar/arazzo-valid.yaml',
      'yaml',
      0,
      specValid,
    );

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    const matchingErrors = resultInvalid.filter(
      (d) => d.code === codes.ARAZZO_STEP_FIELD_SUCCESS_ACTIONS_NAMES_UNIQUE,
    );
    assert(
      matchingErrors.length > 0,
      'Expected at least one ARAZZO_STEP_FIELD_SUCCESS_ACTIONS_NAMES_UNIQUE diagnostic',
    );

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const matchingErrorsValid = resultValid.filter(
      (d) => d.code === codes.ARAZZO_STEP_FIELD_SUCCESS_ACTIONS_NAMES_UNIQUE,
    );
    assert(
      matchingErrorsValid.length === 0,
      'Expected no ARAZZO_STEP_FIELD_SUCCESS_ACTIONS_NAMES_UNIQUE diagnostics for valid fixture',
    );

    languageService.terminate();
  });
});
