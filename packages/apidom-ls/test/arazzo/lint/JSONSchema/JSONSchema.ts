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

describe('test-arazzo-linting-JSONSchema', function () {
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

  it('test SCHEMA_TYPE', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const specInvalid = fs
      .readFileSync(
        path.join(fixturesDir, 'arazzo', 'JSONSchema', 'SCHEMA_TYPE', 'arazzo-invalid.yaml'),
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
        path.join(fixturesDir, 'arazzo', 'JSONSchema', 'SCHEMA_TYPE', 'arazzo-valid.yaml'),
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
    assert(resultInvalid[0].code === codes.SCHEMA_TYPE);

    const resultValid = await languageService.doValidation(docValid, validationContext);
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test SCHEMA_DEPRECATED', async function () {
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
          'JSONSchema',
          'SCHEMA_DEPRECATED',
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
          'JSONSchema',
          'SCHEMA_DEPRECATED',
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
    const deprecatedErrors = resultInvalid.filter((d) => d.code === codes.SCHEMA_DEPRECATED);
    assert(deprecatedErrors.length > 0, 'Expected at least one SCHEMA_DEPRECATED error');

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const deprecatedErrorsValid = resultValid.filter((d) => d.code === codes.SCHEMA_DEPRECATED);
    assert(deprecatedErrorsValid.length === 0, 'Expected no SCHEMA_DEPRECATED errors');

    languageService.terminate();
  });

  it('test SCHEMA_MAXLENGTH', async function () {
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
          'JSONSchema',
          'SCHEMA_MAXLENGTH',
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
          'JSONSchema',
          'SCHEMA_MAXLENGTH',
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
    const maxLengthErrors = resultInvalid.filter((d) => d.code === codes.SCHEMA_MAXLENGTH);
    assert(maxLengthErrors.length > 0, 'Expected at least one SCHEMA_MAXLENGTH error');

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const maxLengthErrorsValid = resultValid.filter((d) => d.code === codes.SCHEMA_MAXLENGTH);
    assert(maxLengthErrorsValid.length === 0, 'Expected no SCHEMA_MAXLENGTH errors');

    languageService.terminate();
  });

  it('test SCHEMA_REQUIRED', async function () {
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
          'JSONSchema',
          'SCHEMA_REQUIRED',
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
          'JSONSchema',
          'SCHEMA_REQUIRED',
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
    const requiredErrors = resultInvalid.filter((d) => d.code === codes.SCHEMA_REQUIRED);
    assert(requiredErrors.length > 0, 'Expected at least one SCHEMA_REQUIRED error');

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const requiredErrorsValid = resultValid.filter((d) => d.code === codes.SCHEMA_REQUIRED);
    assert(requiredErrorsValid.length === 0, 'Expected no SCHEMA_REQUIRED errors');

    languageService.terminate();
  });
});
