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

const readFixture = (folder: string, name: string): string =>
  fs.readFileSync(path.join(fixturesDir, 'overlay', 'reusable-action', folder, name)).toString();

const testRule = async (
  folder: string,
  code: number,
  context: LanguageServiceContext,
): Promise<void> => {
  const validationContext: ValidationContext = {
    comments: DiagnosticSeverity.Error,
    maxNumberOfProblems: 100,
    relatedInformation: false,
  };

  const specInvalid = readFixture(folder, 'overlay-invalid.yaml');
  const docInvalid: TextDocument = TextDocument.create(
    'foo://bar/overlay-invalid.yaml',
    'yaml',
    0,
    specInvalid,
  );
  const specValid = readFixture(folder, 'overlay-valid.yaml');
  const docValid: TextDocument = TextDocument.create(
    'foo://bar/overlay-valid.yaml',
    'yaml',
    0,
    specValid,
  );

  const languageService: LanguageService = getLanguageService(context);

  try {
    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    const matching = resultInvalid.filter((d) => d.code === code);
    assert(
      matching.length > 0,
      `Expected code ${code} but got: ${JSON.stringify(resultInvalid.map((d) => d.code))}`,
    );

    const resultValid = await languageService.doValidation(docValid, validationContext);
    const matchingValid = resultValid.filter((d) => d.code === code);
    assert.strictEqual(
      matchingValid.length,
      0,
      `Expected no ${code} errors but got: ${JSON.stringify(resultValid)}`,
    );
  } finally {
    languageService.terminate();
  }
};

describe('test-overlay-linting-reusable-action', function () {
  const context: LanguageServiceContext = {
    metadata: metadata(),
    validationContext: {
      jsonSchemaValidation: false,
      semanticValidation: true,
      referenceValidation: false,
      semanticLinting: true,
    },
    performanceLogs: logPerformance,
    logLevel,
  };

  it('test OVERLAY_REUSABLE_ACTION_FIELD_DESCRIPTION_TYPE', async function () {
    await testRule(
      'OVERLAY_REUSABLE_ACTION_FIELD_DESCRIPTION_TYPE',
      codes.OVERLAY_REUSABLE_ACTION_FIELD_DESCRIPTION_TYPE,
      context,
    );
  });

  it('test OVERLAY_REUSABLE_ACTION_FIELD_FIELDS_TYPE', async function () {
    await testRule(
      'OVERLAY_REUSABLE_ACTION_FIELD_FIELDS_TYPE',
      codes.OVERLAY_REUSABLE_ACTION_FIELD_FIELDS_TYPE,
      context,
    );
  });

  it('test OVERLAY_REUSABLE_ACTION_NO_SCRIPT_TAGS', async function () {
    await testRule(
      'OVERLAY_REUSABLE_ACTION_NO_SCRIPT_TAGS',
      codes.OVERLAY_SPEC_NO_SCRIPT_TAGS,
      context,
    );
  });

  it('test OVERLAY_REUSABLE_ACTION NOT_ALLOWED_FIELDS', async function () {
    await testRule('OVERLAY_REUSABLE_ACTION_NOT_ALLOWED_FIELDS', codes.NOT_ALLOWED_FIELDS, context);
  });

  it('test Reusable Action with an illegal $ref is still linted', async function () {
    const spec = readFixture('OVERLAY_REUSABLE_ACTION_ILLEGAL_REF', 'overlay-invalid.yaml');
    const doc = TextDocument.create('foo://bar/overlay-invalid.yaml', 'yaml', 0, spec);
    const languageService: LanguageService = getLanguageService(context);
    try {
      const result = await languageService.doValidation(doc, {
        comments: DiagnosticSeverity.Error,
        maxNumberOfProblems: 100,
        relatedInformation: false,
      });
      const resultCodes = result.map((d) => d.code);
      assert.includeMembers(resultCodes, [
        codes.NOT_ALLOWED_FIELDS,
        codes.OVERLAY_REUSABLE_ACTION_FIELD_DESCRIPTION_TYPE,
        codes.OVERLAY_REUSABLE_ACTION_FIELD_FIELDS_TYPE,
      ]);
    } finally {
      languageService.terminate();
    }
  });
});
