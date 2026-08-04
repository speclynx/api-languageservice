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

describe('test-arazzo-linting-reusable', function () {
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

  it('test ARAZZO_REUSABLE_FIELD_REFERENCE_TYPE', async function () {
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
          'reusable',
          'ARAZZO_REUSABLE_FIELD_REFERENCE_TYPE',
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
          'reusable',
          'ARAZZO_REUSABLE_FIELD_REFERENCE_TYPE',
          'arazzo-valid.yaml',
        ),
      )
      .toString();
    const docValid = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, specValid);

    const languageService: LanguageService = getLanguageService(context);

    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    const errors = resultInvalid.filter(
      (d) => d.code === codes.ARAZZO_REUSABLE_FIELD_REFERENCE_TYPE,
    );
    assert(errors.length > 0, 'Expected ARAZZO_REUSABLE_FIELD_REFERENCE_TYPE error');

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const validErrors = resultValid.filter(
      (d) => d.code === codes.ARAZZO_REUSABLE_FIELD_REFERENCE_TYPE,
    );
    assert(validErrors.length === 0, 'Expected no ARAZZO_REUSABLE_FIELD_REFERENCE_TYPE errors');

    languageService.terminate();
  });

  // Codes owned by the parameter / successAction / failureAction rule sets. A Reusable
  // Object must never be linted against these, no matter how malformed it is.
  const targetElementCodes = [
    codes.ARAZZO_PARAMETER_FIELD_NAME_REQUIRED,
    codes.ARAZZO_PARAMETER_FIELD_VALUE_REQUIRED,
    codes.ARAZZO_SUCCESS_ACTION_FIELD_NAME_REQUIRED,
    codes.ARAZZO_SUCCESS_ACTION_FIELD_TYPE_REQUIRED,
    codes.ARAZZO_FAILURE_ACTION_FIELD_NAME_REQUIRED,
    codes.ARAZZO_FAILURE_ACTION_FIELD_TYPE_REQUIRED,
  ];

  const readFixture = (name: string): string =>
    fs
      .readFileSync(path.join(fixturesDir, 'arazzo', 'reusable', 'reusable-usage', name))
      .toString();

  const validationContext: ValidationContext = {
    comments: DiagnosticSeverity.Error,
    maxNumberOfProblems: 100,
    relatedInformation: false,
  };

  ['arazzo-valid.yaml', 'arazzo-valid-1.0.0.yaml'].forEach((fixture) => {
    it(`Reusable Objects are not linted as parameter/successAction/failureAction (${fixture})`, async function () {
      const doc: TextDocument = TextDocument.create(
        `foo://bar/reusable-usage-${fixture}`,
        'yaml',
        0,
        readFixture(fixture),
      );

      const languageService: LanguageService = getLanguageService(context);

      const result = await languageService.doValidation(doc, validationContext);
      const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
      assert(
        errors.length === 0,
        `Expected no errors but got ${errors.length}: ${JSON.stringify(errors.map((e) => ({ code: e.code, message: e.message })))}`,
      );

      languageService.terminate();
    });
  });

  it('malformed Reusable Objects are still linted by the reusable rule set', async function () {
    const doc: TextDocument = TextDocument.create(
      'foo://bar/reusable-usage-invalid.yaml',
      'yaml',
      0,
      readFixture('arazzo-invalid.yaml'),
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(doc, validationContext);

    // the guard must not blanket-disable validation: the reusable rules still fire
    const notAllowedFields = result.filter((d) => d.code === codes.NOT_ALLOWED_FIELDS);
    assert.strictEqual(
      notAllowedFields.length,
      2,
      `Expected 2 NOT_ALLOWED_FIELDS errors but got ${notAllowedFields.length}`,
    );
    assert(
      result.some((d) => d.code === codes.ARAZZO_REUSABLE_FIELD_REFERENCE_TYPE),
      'Expected ARAZZO_REUSABLE_FIELD_REFERENCE_TYPE error for a non-string reference',
    );

    // ...but the target-element rules must stay silent
    const leaked = result.filter((d) => targetElementCodes.includes(d.code as number));
    assert(
      leaked.length === 0,
      `Reusable Objects were linted as parameter/successAction/failureAction: ${JSON.stringify(leaked.map((e) => ({ code: e.code, message: e.message })))}`,
    );

    languageService.terminate();
  });
});
