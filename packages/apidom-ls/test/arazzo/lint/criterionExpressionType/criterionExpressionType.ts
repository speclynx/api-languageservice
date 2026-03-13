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

const fixturesDir = fileURLToPath(new URL('../../../fixtures', import.meta.url));

describe('test-arazzo-linting-criterionExpressionType', function () {
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

  it('test valid criterionExpressionType produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const specValid = fs
      .readFileSync(
        path.join(
          fixturesDir,
          'arazzo',
          'criterionExpressionType',
          'ARAZZO_CRITERION_EXPRESSION_TYPE_FIELD_TYPE_REQUIRED',
          'arazzo-valid.yaml',
        ),
      )
      .toString();
    const docValid = TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, specValid);

    const languageService: LanguageService = getLanguageService(context);

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const errors = resultValid.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert(
      errors.length === 0,
      `Expected no errors but got: ${JSON.stringify(errors.map((e) => ({ code: e.code, message: e.message })))}`,
    );

    languageService.terminate();
  });
});
