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

describe('test-arazzo-linting-info', function () {
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

  it('test ARAZZO_INFO_FIELD_TITLE_REQUIRED', async function () {
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
          'info',
          'ARAZZO_INFO_FIELD_TITLE_REQUIRED',
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
          'info',
          'ARAZZO_INFO_FIELD_TITLE_REQUIRED',
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
    // Should produce at least one error for ARAZZO_INFO_FIELD_TITLE_REQUIRED
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_INFO_FIELD_TITLE_REQUIRED);

    const resultValid = await languageService.doValidation(docValid, validationContext);

    // Should produce no error for ARAZZO_INFO_FIELD_TITLE_REQUIRED
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_INFO_FIELD_TITLE_TYPE', async function () {
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
          'info',
          'ARAZZO_INFO_FIELD_TITLE_TYPE',
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
          'info',
          'ARAZZO_INFO_FIELD_TITLE_TYPE',
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
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_INFO_FIELD_TITLE_TYPE);

    const resultValid = await languageService.doValidation(docValid, validationContext);
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_INFO_FIELD_VERSION_REQUIRED', async function () {
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
          'info',
          'ARAZZO_INFO_FIELD_VERSION_REQUIRED',
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
          'info',
          'ARAZZO_INFO_FIELD_VERSION_REQUIRED',
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
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_INFO_FIELD_VERSION_REQUIRED);

    const resultValid = await languageService.doValidation(docValid, validationContext);
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_INFO_FIELD_VERSION_TYPE', async function () {
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
          'info',
          'ARAZZO_INFO_FIELD_VERSION_TYPE',
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
          'info',
          'ARAZZO_INFO_FIELD_VERSION_TYPE',
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
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_INFO_FIELD_VERSION_TYPE);

    const resultValid = await languageService.doValidation(docValid, validationContext);
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_INFO_FIELD_SUMMARY_TYPE', async function () {
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
          'info',
          'ARAZZO_INFO_FIELD_SUMMARY_TYPE',
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
          'info',
          'ARAZZO_INFO_FIELD_SUMMARY_TYPE',
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
    assert(resultInvalid.length > 0);
    assert(resultInvalid[0].code === codes.ARAZZO_INFO_FIELD_SUMMARY_TYPE);

    const resultValid = await languageService.doValidation(docValid, validationContext);
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_INFO_FIELD_DESCRIPTION_RECOMMENDED', async function () {
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
          'info',
          'ARAZZO_INFO_FIELD_DESCRIPTION_RECOMMENDED',
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
          'info',
          'ARAZZO_INFO_FIELD_DESCRIPTION_RECOMMENDED',
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
      (d) => d.code === codes.ARAZZO_INFO_FIELD_DESCRIPTION_RECOMMENDED,
    );
    assert(
      matchingErrors.length > 0,
      `Expected at least one ARAZZO_INFO_FIELD_DESCRIPTION_RECOMMENDED warning`,
    );

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const matchingErrorsValid = resultValid.filter(
      (d) => d.code === codes.ARAZZO_INFO_FIELD_DESCRIPTION_RECOMMENDED,
    );
    assert(
      matchingErrorsValid.length === 0,
      `Expected no ARAZZO_INFO_FIELD_DESCRIPTION_RECOMMENDED warnings for valid fixture`,
    );

    languageService.terminate();
  });

  it('test ARAZZO_INFO_FIELD_SUMMARY_RECOMMENDED', async function () {
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
          'info',
          'ARAZZO_INFO_FIELD_SUMMARY_RECOMMENDED',
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
          'info',
          'ARAZZO_INFO_FIELD_SUMMARY_RECOMMENDED',
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
      (d) => d.code === codes.ARAZZO_INFO_FIELD_SUMMARY_RECOMMENDED,
    );
    assert(
      matchingErrors.length > 0,
      `Expected at least one ARAZZO_INFO_FIELD_SUMMARY_RECOMMENDED hint`,
    );

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const matchingErrorsValid = resultValid.filter(
      (d) => d.code === codes.ARAZZO_INFO_FIELD_SUMMARY_RECOMMENDED,
    );
    assert(
      matchingErrorsValid.length === 0,
      `Expected no ARAZZO_INFO_FIELD_SUMMARY_RECOMMENDED hints for valid fixture`,
    );

    languageService.terminate();
  });
});
