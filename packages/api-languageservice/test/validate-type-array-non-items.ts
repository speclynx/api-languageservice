import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import { fileURLToPath } from 'node:url';

import getLanguageService from '../src/apidom-language-service.ts';
import {
  LanguageService,
  LanguageServiceContext,
  ValidationContext,
} from '../src/apidom-language-types.ts';
import { metadata } from './metadata.ts';
import { logPerformance, logLevel } from './test-utils.ts';
import ApilintCodes from '../src/config/codes.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const specOpenapi31 = fs
  .readFileSync(
    path.join(
      __dirname,
      'fixtures',
      'validation',
      'oas',
      'type-array-non-items',
      'openapi31-array-no-items.json',
    ),
  )
  .toString();

const specAsync22 = fs
  .readFileSync(
    path.join(
      __dirname,
      'fixtures',
      'validation',
      'asyncapi',
      'type-array-non-items',
      'asyncapi22-array-no-items.yaml',
    ),
  )
  .toString();

describe('apidom-ls-validate-type-array-non-items', function () {
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

  const validationContext: ValidationContext = {
    comments: DiagnosticSeverity.Error,
    maxNumberOfProblems: 100,
    relatedInformation: false,
  };

  it('should report type: array without items in OpenAPI 3.1', async function () {
    const doc: TextDocument = TextDocument.create(
      'foo://bar/openapi31-array-no-items.json',
      'json',
      0,
      specOpenapi31,
    );

    const languageService: LanguageService = getLanguageService(context);

    try {
      const result = await languageService.doValidation(doc, validationContext);
      const typeArrayDiags = result.filter(
        (d) => d.code === ApilintCodes.SCHEMA_TYPE_ARRAY_NON_ITEMS,
      );

      assert.lengthOf(typeArrayDiags, 1, 'expected exactly one type-array-non-items diagnostic');
      assert.strictEqual(
        typeArrayDiags[0].message,
        'Schemas with "type: array" require a sibling "items" field',
      );
      assert.strictEqual(typeArrayDiags[0].severity, DiagnosticSeverity.Error);
      assert.strictEqual(typeArrayDiags[0].source, 'apilint');
      assert.strictEqual(typeArrayDiags[0].range.start.line, 16);
    } finally {
      languageService.terminate();
    }
  });

  it('should report type: array without items in AsyncAPI 2.2', async function () {
    const doc: TextDocument = TextDocument.create(
      'foo://bar/asyncapi22-array-no-items.yaml',
      'yaml',
      0,
      specAsync22,
    );

    const languageService: LanguageService = getLanguageService(context);

    try {
      const result = await languageService.doValidation(doc, validationContext);
      const typeArrayDiags = result.filter(
        (d) => d.code === ApilintCodes.SCHEMA_TYPE_ARRAY_NON_ITEMS,
      );

      assert.lengthOf(typeArrayDiags, 1, 'expected exactly one type-array-non-items diagnostic');
      assert.strictEqual(
        typeArrayDiags[0].message,
        'Schemas with "type: array" require a sibling "items" field',
      );
      assert.strictEqual(typeArrayDiags[0].severity, DiagnosticSeverity.Error);
      assert.strictEqual(typeArrayDiags[0].source, 'apilint');
      assert.strictEqual(typeArrayDiags[0].range.start.line, 13);
    } finally {
      languageService.terminate();
    }
  });

  it('should not report type: array with items present', async function () {
    const specWithItems = `openapi: 3.1.0
info:
  title: Test
  version: 1.0.0
paths: {}
components:
  schemas:
    ArrayWithItems:
      type: array
      items:
        type: string
`;

    const doc: TextDocument = TextDocument.create(
      'foo://bar/array-with-items.yaml',
      'yaml',
      0,
      specWithItems,
    );

    const languageService: LanguageService = getLanguageService(context);

    try {
      const result = await languageService.doValidation(doc, validationContext);
      const typeArrayDiags = result.filter(
        (d) => d.code === ApilintCodes.SCHEMA_TYPE_ARRAY_NON_ITEMS,
      );

      assert.lengthOf(typeArrayDiags, 0, 'expected no type-array-non-items diagnostic');
    } finally {
      languageService.terminate();
    }
  });
});
