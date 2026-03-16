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

describe('test-arazzo-linting-step', function () {
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

  it('test ARAZZO_STEP_FIELD_STEP_ID_REQUIRED', async function () {
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
          'step',
          'ARAZZO_STEP_FIELD_STEP_ID_REQUIRED',
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
          'step',
          'ARAZZO_STEP_FIELD_STEP_ID_REQUIRED',
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
    assert(resultInvalid[0].code === codes.ARAZZO_STEP_FIELD_STEP_ID_REQUIRED);

    const resultValid = await languageService.doValidation(docValid, validationContext);
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_DESCRIPTION_TYPE', async function () {
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
          'step',
          'ARAZZO_STEP_FIELD_DESCRIPTION_TYPE',
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
          'step',
          'ARAZZO_STEP_FIELD_DESCRIPTION_TYPE',
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
    assert(resultInvalid[0].code === codes.ARAZZO_STEP_FIELD_DESCRIPTION_TYPE);

    const resultValid = await languageService.doValidation(docValid, validationContext);
    assert(resultValid.length == 0);

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE', async function () {
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
          'step',
          'ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE',
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
          'step',
          'ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE',
          'arazzo-valid.yaml',
        ),
      )
      .toString();
    const docValid = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, specValid);

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    const errors = resultInvalid.filter(
      (d) => d.code === codes.ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE,
    );
    assert(errors.length > 0, 'Expected ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE error');

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const validErrors = resultValid.filter(
      (d) => d.code === codes.ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE,
    );
    assert(
      validErrors.length === 0,
      'Expected no ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE errors',
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_OPERATION_ID_MUTUALLY_EXCLUSIVE', async function () {
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
          'step',
          'ARAZZO_STEP_FIELD_OPERATION_ID_MUTUALLY_EXCLUSIVE',
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
          'step',
          'ARAZZO_STEP_FIELD_OPERATION_ID_MUTUALLY_EXCLUSIVE',
          'arazzo-valid.yaml',
        ),
      )
      .toString();
    const docValid = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, specValid);

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    const errors = resultInvalid.filter(
      (d) => d.code === codes.ARAZZO_STEP_FIELD_OPERATION_ID_MUTUALLY_EXCLUSIVE,
    );
    assert(errors.length > 0, 'Expected ARAZZO_STEP_FIELD_OPERATION_ID_MUTUALLY_EXCLUSIVE error');

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const validErrors = resultValid.filter(
      (d) => d.code === codes.ARAZZO_STEP_FIELD_OPERATION_ID_MUTUALLY_EXCLUSIVE,
    );
    assert(
      validErrors.length === 0,
      'Expected no ARAZZO_STEP_FIELD_OPERATION_ID_MUTUALLY_EXCLUSIVE errors',
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_DESCRIPTION_RECOMMENDED', async function () {
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
          'step',
          'ARAZZO_STEP_FIELD_DESCRIPTION_RECOMMENDED',
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
          'step',
          'ARAZZO_STEP_FIELD_DESCRIPTION_RECOMMENDED',
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
      (d) => d.code === codes.ARAZZO_STEP_FIELD_DESCRIPTION_RECOMMENDED,
    );
    assert(matchingErrors.length > 0, 'Expected at least one ARAZZO_STEP_FIELD_DESCRIPTION_RECOMMENDED diagnostic');

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const matchingErrorsValid = resultValid.filter(
      (d) => d.code === codes.ARAZZO_STEP_FIELD_DESCRIPTION_RECOMMENDED,
    );
    assert(matchingErrorsValid.length === 0, 'Expected no ARAZZO_STEP_FIELD_DESCRIPTION_RECOMMENDED diagnostics for valid fixture');

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_OPERATION_PATH_PREFER_OPERATION_ID', async function () {
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
          'step',
          'ARAZZO_STEP_FIELD_OPERATION_PATH_PREFER_OPERATION_ID',
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
          'step',
          'ARAZZO_STEP_FIELD_OPERATION_PATH_PREFER_OPERATION_ID',
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
      (d) => d.code === codes.ARAZZO_STEP_FIELD_OPERATION_PATH_PREFER_OPERATION_ID,
    );
    assert(matchingErrors.length > 0, 'Expected at least one ARAZZO_STEP_FIELD_OPERATION_PATH_PREFER_OPERATION_ID diagnostic');

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const matchingErrorsValid = resultValid.filter(
      (d) => d.code === codes.ARAZZO_STEP_FIELD_OPERATION_PATH_PREFER_OPERATION_ID,
    );
    assert(matchingErrorsValid.length === 0, 'Expected no ARAZZO_STEP_FIELD_OPERATION_PATH_PREFER_OPERATION_ID diagnostics for valid fixture');

    languageService.terminate();
  });

  it('test ARAZZO_WORKFLOW_FIELD_STEP_ID_UNIQUE', async function () {
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
          'step',
          'ARAZZO_WORKFLOW_FIELD_STEP_ID_UNIQUE',
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
          'step',
          'ARAZZO_WORKFLOW_FIELD_STEP_ID_UNIQUE',
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
      (d) => d.code === codes.ARAZZO_WORKFLOW_FIELD_STEP_ID_UNIQUE,
    );
    assert(
      matchingErrors.length > 0,
      'Expected at least one ARAZZO_WORKFLOW_FIELD_STEP_ID_UNIQUE diagnostic',
    );

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const matchingErrorsValid = resultValid.filter(
      (d) => d.code === codes.ARAZZO_WORKFLOW_FIELD_STEP_ID_UNIQUE,
    );
    assert(
      matchingErrorsValid.length === 0,
      'Expected no ARAZZO_WORKFLOW_FIELD_STEP_ID_UNIQUE diagnostics for valid fixture',
    );

    languageService.terminate();
  });

  it('test ARAZZO_STEP_FIELD_OUTPUTS_NAMES_UNIQUE', async function () {
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
          'step',
          'ARAZZO_STEP_FIELD_OUTPUTS_NAMES_UNIQUE',
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
          'step',
          'ARAZZO_STEP_FIELD_OUTPUTS_NAMES_UNIQUE',
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
      (d) => d.code === codes.ARAZZO_STEP_FIELD_OUTPUTS_NAMES_UNIQUE,
    );
    assert(
      matchingErrors.length > 0,
      'Expected at least one ARAZZO_STEP_FIELD_OUTPUTS_NAMES_UNIQUE diagnostic',
    );

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const matchingErrorsValid = resultValid.filter(
      (d) => d.code === codes.ARAZZO_STEP_FIELD_OUTPUTS_NAMES_UNIQUE,
    );
    assert(
      matchingErrorsValid.length === 0,
      'Expected no ARAZZO_STEP_FIELD_OUTPUTS_NAMES_UNIQUE diagnostics for valid fixture',
    );

    languageService.terminate();
  });
});
