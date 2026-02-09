import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { includesClasses } from '@speclynx/apidom-datamodel';

import getLanguageService from '../src/apidom-language-service.ts';
import {
  LanguageService,
  LanguageServiceContext,
  ValidationContext,
} from '../src/apidom-language-types.ts';
import { findNamespace } from '../src/utils/utils.ts';
import { parse } from '../src/parser-factory.ts';
import { metadata } from './metadata.ts';
import { logPerformance, logLevel } from './test-utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const specArazzoJson101 = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'arazzo', 'sample-arazzo.json'))
  .toString();

describe('apidom-ls-arazzo-json', function () {
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

  it('test namespace detection for arazzo 1.0.1 json', async function () {
    const contentLanguage = await findNamespace(specArazzoJson101);

    assert.strictEqual(contentLanguage.namespace, 'arazzo');
    assert.strictEqual(contentLanguage.version, '1.0.1');
    assert.strictEqual(contentLanguage.format, 'JSON');
    assert.strictEqual(
      contentLanguage.mediaType,
      'application/vnd.oai.workflows+json;version=1.0.1',
    );
  });

  it('test validation for arazzo 1.0.1 json produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docArazzoJson: TextDocument = TextDocument.create(
      'foo://bar/arazzo.json',
      'json',
      0,
      specArazzoJson101,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docArazzoJson, validationContext);

    // Valid document should produce no errors
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test sourceDescriptionsResolution disabled by default (JSON)', async function () {
    const arazzoFilePath = path.join(__dirname, 'fixtures', 'arazzo', 'sample-arazzo.json');
    const docArazzoJson: TextDocument = TextDocument.create(
      pathToFileURL(arazzoFilePath).toString(),
      'json',
      0,
      specArazzoJson101,
    );

    // Without parseContext.arazzo.sourceDescriptionsResolution, source descriptions should NOT be resolved
    const result = await parse(docArazzoJson, metadata().metadataMaps);

    // ParseResult should only contain the main Arazzo document, no source description results
    const sourceDescriptionResults = [...result].filter((el) =>
      includesClasses(el, ['source-description']),
    );
    assert.strictEqual(
      sourceDescriptionResults.length,
      0,
      'Source descriptions should not be resolved when sourceDescriptionsResolution is disabled',
    );
  });

  it('test sourceDescriptionsResolution resolves relative URLs (JSON)', async function () {
    const arazzoFilePath = path.join(__dirname, 'fixtures', 'arazzo', 'sample-arazzo.json');
    const docArazzoJson: TextDocument = TextDocument.create(
      pathToFileURL(arazzoFilePath).toString(),
      'json',
      0,
      specArazzoJson101,
    );

    // Enable source descriptions resolution with file allow list
    const result = await parse(
      docArazzoJson,
      metadata().metadataMaps,
      true,
      true,
      true,
      undefined,
      {
        fileAllowList: ['*'],
        arazzo: { sourceDescriptionsResolution: true },
      },
    );

    // ParseResult should contain source description results
    const sourceDescriptionResults = [...result].filter((el) =>
      includesClasses(el, ['source-description']),
    );
    assert.isAtLeast(
      sourceDescriptionResults.length,
      1,
      'At least one source description should be resolved',
    );
  });
});
