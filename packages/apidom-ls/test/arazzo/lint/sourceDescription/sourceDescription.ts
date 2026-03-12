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

describe('test-arazzo-linting-sourceDescription', function () {
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

  it('test ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_REQUIRED', async function () {
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
          'sourceDescription',
          'ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_REQUIRED',
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
          'sourceDescription',
          'ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_REQUIRED',
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
    // Should produce at least one error for ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_REQUIRED
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_REQUIRED);

    const resultValid = await languageService.doValidation(docValid, validationContext);

    // Should produce no error for ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_REQUIRED
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_SOURCE_DESCRIPTION_FIELD_URL_REQUIRED', async function () {
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
          'sourceDescription',
          'ARAZZO_SOURCE_DESCRIPTION_FIELD_URL_REQUIRED',
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
          'sourceDescription',
          'ARAZZO_SOURCE_DESCRIPTION_FIELD_URL_REQUIRED',
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
    // Should produce at least one error for ARAZZO_SOURCE_DESCRIPTION_FIELD_URL_REQUIRED
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_SOURCE_DESCRIPTION_FIELD_URL_REQUIRED);

    const resultValid = await languageService.doValidation(docValid, validationContext);

    // Should produce no error for ARAZZO_SOURCE_DESCRIPTION_FIELD_URL_REQUIRED
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_EQUALS', async function () {
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
          'sourceDescription',
          'ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_EQUALS',
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
          'sourceDescription',
          'ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_EQUALS',
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
    // Should produce at least one error for ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_EQUALS
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_EQUALS);

    const resultValid = await languageService.doValidation(docValid, validationContext);

    // Should produce no error for ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_EQUALS
    assert(resultValid.length == 0);

    languageService.terminate();
  });
});
