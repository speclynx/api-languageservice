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
  fs.readFileSync(path.join(fixturesDir, 'overlay', 'action', folder, name)).toString();

const runInvalid = async (
  folder: string,
  invalidName: string,
  code: number,
  context: LanguageServiceContext,
): Promise<void> => {
  const validationContext: ValidationContext = {
    comments: DiagnosticSeverity.Error,
    maxNumberOfProblems: 100,
    relatedInformation: false,
  };
  const specInvalid = readFixture(folder, invalidName);
  const docInvalid: TextDocument = TextDocument.create(
    `foo://bar/${invalidName}`,
    'yaml',
    0,
    specInvalid,
  );
  const languageService: LanguageService = getLanguageService(context);
  try {
    const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
    const matching = resultInvalid.filter((d) => d.code === code);
    assert(
      matching.length > 0,
      `Expected code ${code} in ${invalidName} but got: ${JSON.stringify(resultInvalid.map((d) => d.code))}`,
    );
  } finally {
    languageService.terminate();
  }
};

const runValid = async (
  folder: string,
  code: number,
  context: LanguageServiceContext,
): Promise<void> => {
  const validationContext: ValidationContext = {
    comments: DiagnosticSeverity.Error,
    maxNumberOfProblems: 100,
    relatedInformation: false,
  };
  const specValid = readFixture(folder, 'overlay-valid.yaml');
  const docValid: TextDocument = TextDocument.create(
    'foo://bar/overlay-valid.yaml',
    'yaml',
    0,
    specValid,
  );
  const languageService: LanguageService = getLanguageService(context);
  try {
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

const testRule = async (
  folder: string,
  code: number,
  context: LanguageServiceContext,
): Promise<void> => {
  await runInvalid(folder, 'overlay-invalid.yaml', code, context);
  await runValid(folder, code, context);
};

describe('test-overlay-linting-action', function () {
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

  it('test OVERLAY_ACTION_FIELD_TARGET_REQUIRED', async function () {
    await testRule(
      'OVERLAY_ACTION_FIELD_TARGET_REQUIRED',
      codes.OVERLAY_ACTION_FIELD_TARGET_REQUIRED,
      context,
    );
  });

  it('test OVERLAY_ACTION_FIELD_TARGET_TYPE', async function () {
    await testRule(
      'OVERLAY_ACTION_FIELD_TARGET_TYPE',
      codes.OVERLAY_ACTION_FIELD_TARGET_TYPE,
      context,
    );
  });

  it('test OVERLAY_ACTION_FIELD_TARGET_JSONPATH_VALID', async function () {
    await testRule(
      'OVERLAY_ACTION_FIELD_TARGET_JSONPATH_VALID',
      codes.OVERLAY_ACTION_FIELD_TARGET_JSONPATH_VALID,
      context,
    );
  });

  it('test OVERLAY_ACTION_FIELD_DESCRIPTION_TYPE', async function () {
    await testRule(
      'OVERLAY_ACTION_FIELD_DESCRIPTION_TYPE',
      codes.OVERLAY_ACTION_FIELD_DESCRIPTION_TYPE,
      context,
    );
  });

  it('test OVERLAY_ACTION_FIELD_COPY_TYPE', async function () {
    await testRule('OVERLAY_ACTION_FIELD_COPY_TYPE', codes.OVERLAY_ACTION_FIELD_COPY_TYPE, context);
  });

  it('test OVERLAY_ACTION_FIELD_COPY_JSONPATH_VALID', async function () {
    await testRule(
      'OVERLAY_ACTION_FIELD_COPY_JSONPATH_VALID',
      codes.OVERLAY_ACTION_FIELD_COPY_JSONPATH_VALID,
      context,
    );
  });

  it('test OVERLAY_ACTION_FIELD_REMOVE_TYPE', async function () {
    await testRule(
      'OVERLAY_ACTION_FIELD_REMOVE_TYPE',
      codes.OVERLAY_ACTION_FIELD_REMOVE_TYPE,
      context,
    );
  });

  it('test OVERLAY_ACTION_FIELD_UPDATE_COPY_MUTUALLY_EXCLUSIVE', async function () {
    await testRule(
      'OVERLAY_ACTION_FIELD_UPDATE_COPY_MUTUALLY_EXCLUSIVE',
      codes.OVERLAY_ACTION_FIELD_UPDATE_COPY_MUTUALLY_EXCLUSIVE,
      context,
    );
  });

  it('test OVERLAY_ACTION_FIELD_UPDATE_REMOVE_MUTUALLY_EXCLUSIVE (1.0.0 warning)', async function () {
    await runInvalid(
      'OVERLAY_ACTION_FIELD_UPDATE_REMOVE_MUTUALLY_EXCLUSIVE',
      'overlay-1-0-invalid.yaml',
      codes.OVERLAY_ACTION_FIELD_UPDATE_REMOVE_MUTUALLY_EXCLUSIVE,
      context,
    );
    await runValid(
      'OVERLAY_ACTION_FIELD_UPDATE_REMOVE_MUTUALLY_EXCLUSIVE',
      codes.OVERLAY_ACTION_FIELD_UPDATE_REMOVE_MUTUALLY_EXCLUSIVE,
      context,
    );
  });

  it('test OVERLAY_ACTION_FIELD_UPDATE_REMOVE_MUTUALLY_EXCLUSIVE (1.1.0 error)', async function () {
    await runInvalid(
      'OVERLAY_ACTION_FIELD_UPDATE_REMOVE_MUTUALLY_EXCLUSIVE',
      'overlay-1-1-invalid.yaml',
      codes.OVERLAY_ACTION_FIELD_UPDATE_REMOVE_MUTUALLY_EXCLUSIVE,
      context,
    );
  });

  it('test OVERLAY_ACTION_FIELD_COPY_REMOVE_MUTUALLY_EXCLUSIVE', async function () {
    await testRule(
      'OVERLAY_ACTION_FIELD_COPY_REMOVE_MUTUALLY_EXCLUSIVE',
      codes.OVERLAY_ACTION_FIELD_COPY_REMOVE_MUTUALLY_EXCLUSIVE,
      context,
    );
  });

  it('test copy NOT_ALLOWED_FIELDS in Overlay 1.0.0', async function () {
    await testRule('OVERLAY_ACTION_COPY_NOT_ALLOWED_1_0', codes.NOT_ALLOWED_FIELDS, context);
  });
});
