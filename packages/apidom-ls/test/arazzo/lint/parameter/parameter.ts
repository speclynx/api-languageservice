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

describe('test-arazzo-linting-parameter', function () {
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

  it('test ARAZZO_PARAMETER_FIELD_NAME_REQUIRED', async function () {
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
          'parameter',
          'ARAZZO_PARAMETER_FIELD_NAME_REQUIRED',
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
          'parameter',
          'ARAZZO_PARAMETER_FIELD_NAME_REQUIRED',
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
    // Should produce at least one error for ARAZZO_PARAMETER_FIELD_NAME_REQUIRED
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_PARAMETER_FIELD_NAME_REQUIRED);

    const resultValid = await languageService.doValidation(docValid, validationContext);

    // Should produce no error for ARAZZO_PARAMETER_FIELD_NAME_REQUIRED
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_PARAMETER_FIELD_VALUE_REQUIRED', async function () {
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
          'parameter',
          'ARAZZO_PARAMETER_FIELD_VALUE_REQUIRED',
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
          'parameter',
          'ARAZZO_PARAMETER_FIELD_VALUE_REQUIRED',
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
    // Should produce at least one error for ARAZZO_PARAMETER_FIELD_VALUE_REQUIRED
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_PARAMETER_FIELD_VALUE_REQUIRED);

    const resultValid = await languageService.doValidation(docValid, validationContext);

    // Should produce no error for ARAZZO_PARAMETER_FIELD_VALUE_REQUIRED
    assert(resultValid.length == 0);

    languageService.terminate();
  });
});
