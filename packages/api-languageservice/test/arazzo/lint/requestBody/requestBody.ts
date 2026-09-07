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

describe('test-arazzo-linting-requestBody', function () {
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

  it('test ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_TYPE', async function () {
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
          'requestBody',
          'ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_TYPE',
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
          'requestBody',
          'ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_TYPE',
          'arazzo-valid.yaml',
        ),
      )
      .toString();
    const docValid = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, specValid);

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    const errors = resultInvalid.filter(
      (d) => d.code === codes.ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_TYPE,
    );
    assert(errors.length > 0, 'Expected ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_TYPE error');

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const validErrors = resultValid.filter(
      (d) => d.code === codes.ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_TYPE,
    );
    assert(
      validErrors.length === 0,
      'Expected no ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_TYPE errors',
    );

    languageService.terminate();
  });

  it('test ARAZZO_REQUEST_BODY_FIELD_REPLACEMENTS_TYPE', async function () {
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
          'requestBody',
          'ARAZZO_REQUEST_BODY_FIELD_REPLACEMENTS_TYPE',
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
          'requestBody',
          'ARAZZO_REQUEST_BODY_FIELD_REPLACEMENTS_TYPE',
          'arazzo-valid.yaml',
        ),
      )
      .toString();
    const docValid = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, specValid);

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    const errors = resultInvalid.filter(
      (d) => d.code === codes.ARAZZO_REQUEST_BODY_FIELD_REPLACEMENTS_TYPE,
    );
    assert(errors.length > 0, 'Expected ARAZZO_REQUEST_BODY_FIELD_REPLACEMENTS_TYPE error');

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const validErrors = resultValid.filter(
      (d) => d.code === codes.ARAZZO_REQUEST_BODY_FIELD_REPLACEMENTS_TYPE,
    );
    assert(
      validErrors.length === 0,
      'Expected no ARAZZO_REQUEST_BODY_FIELD_REPLACEMENTS_TYPE errors',
    );

    languageService.terminate();
  });

  it('test ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_FORMAT', async function () {
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
          'requestBody',
          'ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_FORMAT',
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
          'requestBody',
          'ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_FORMAT',
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
      (d) => d.code === codes.ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_FORMAT,
    );
    assert(
      matchingErrors.length > 0,
      'Expected at least one ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_FORMAT diagnostic',
    );

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const matchingErrorsValid = resultValid.filter(
      (d) => d.code === codes.ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_FORMAT,
    );
    assert(
      matchingErrorsValid.length === 0,
      'Expected no ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_FORMAT diagnostics for valid fixture',
    );

    languageService.terminate();
  });
});
