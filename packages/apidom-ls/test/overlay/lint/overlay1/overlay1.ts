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
  fs.readFileSync(path.join(fixturesDir, 'overlay', 'overlay1', folder, name)).toString();

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

describe('test-overlay-linting-overlay1', function () {
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

  // Note: OVERLAY_SPEC_FIELD_OVERLAY_REQUIRED / _TYPE / _PATTERN are not testable
  // through the default parsing flow because namespace detection requires
  // `overlay: 1.x.y` to be present and well-formed — mirroring Arazzo's behavior.
  // JSON Schema validation catches these cases at document load time.

  it('test OVERLAY_SPEC_FIELD_INFO_REQUIRED', async function () {
    await testRule(
      'OVERLAY_SPEC_FIELD_INFO_REQUIRED',
      codes.OVERLAY_SPEC_FIELD_INFO_REQUIRED,
      context,
    );
  });

  it('test OVERLAY_SPEC_FIELD_EXTENDS_TYPE', async function () {
    await testRule(
      'OVERLAY_SPEC_FIELD_EXTENDS_TYPE',
      codes.OVERLAY_SPEC_FIELD_EXTENDS_TYPE,
      context,
    );
  });

  it('test OVERLAY_SPEC_FIELD_EXTENDS_FORMAT_URI', async function () {
    await testRule(
      'OVERLAY_SPEC_FIELD_EXTENDS_FORMAT_URI',
      codes.OVERLAY_SPEC_FIELD_EXTENDS_FORMAT_URI,
      context,
    );
  });

  it('test OVERLAY_SPEC_FIELD_ACTIONS_REQUIRED', async function () {
    await testRule(
      'OVERLAY_SPEC_FIELD_ACTIONS_REQUIRED',
      codes.OVERLAY_SPEC_FIELD_ACTIONS_REQUIRED,
      context,
    );
  });

  it('test OVERLAY_SPEC_FIELD_ACTIONS_NON_EMPTY', async function () {
    await testRule(
      'OVERLAY_SPEC_FIELD_ACTIONS_NON_EMPTY',
      codes.OVERLAY_SPEC_FIELD_ACTIONS_NON_EMPTY,
      context,
    );
  });

  it('test OVERLAY_SPEC_NO_SCRIPT_TAGS', async function () {
    await testRule('OVERLAY_SPEC_NO_SCRIPT_TAGS', codes.OVERLAY_SPEC_NO_SCRIPT_TAGS, context);
  });

  it('test OVERLAY_SPEC NOT_ALLOWED_FIELDS', async function () {
    await testRule('OVERLAY_SPEC_NOT_ALLOWED_FIELDS', codes.NOT_ALLOWED_FIELDS, context);
  });
});
