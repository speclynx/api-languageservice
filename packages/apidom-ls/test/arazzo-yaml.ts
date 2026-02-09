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

const specArazzoYaml101 = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'arazzo', 'sample-arazzo.yaml'))
  .toString();

const specArazzoYaml100 = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'arazzo', 'sample-arazzo-1.0.0.yaml'))
  .toString();

describe('apidom-ls-arazzo-yaml', function () {
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

  it('test namespace detection for arazzo 1.0.1 yaml', async function () {
    const contentLanguage = await findNamespace(specArazzoYaml101);

    assert.strictEqual(contentLanguage.namespace, 'arazzo');
    assert.strictEqual(contentLanguage.version, '1.0.1');
    assert.strictEqual(contentLanguage.format, 'YAML');
    assert.strictEqual(
      contentLanguage.mediaType,
      'application/vnd.oai.workflows+yaml;version=1.0.1',
    );
  });

  it('test namespace detection for arazzo 1.0.0 yaml', async function () {
    const contentLanguage = await findNamespace(specArazzoYaml100);

    assert.strictEqual(contentLanguage.namespace, 'arazzo');
    assert.strictEqual(contentLanguage.version, '1.0.0');
    assert.strictEqual(contentLanguage.format, 'YAML');
    assert.strictEqual(
      contentLanguage.mediaType,
      'application/vnd.oai.workflows+yaml;version=1.0.0',
    );
  });

  it('test validation for arazzo 1.0.1 yaml produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docArazzoYaml: TextDocument = TextDocument.create(
      'foo://bar/arazzo.yaml',
      'yaml',
      0,
      specArazzoYaml101,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docArazzoYaml, validationContext);

    // Valid document should produce no errors
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test validation for arazzo 1.0.0 yaml produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docArazzoYaml: TextDocument = TextDocument.create(
      'foo://bar/arazzo-1.0.0.yaml',
      'yaml',
      0,
      specArazzoYaml100,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docArazzoYaml, validationContext);

    // Valid document should produce no errors
    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test sourceDescriptionsResolution disabled by default', async function () {
    const arazzoFilePath = path.join(__dirname, 'fixtures', 'arazzo', 'sample-arazzo.yaml');
    const docArazzoYaml: TextDocument = TextDocument.create(
      pathToFileURL(arazzoFilePath).toString(),
      'yaml',
      0,
      specArazzoYaml101,
    );

    // Without parseContext.arazzo.sourceDescriptionsResolution, source descriptions should NOT be resolved
    const result = await parse(docArazzoYaml, metadata().metadataMaps);

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

  it('test sourceDescriptionsResolution resolves relative URLs (YAML)', async function () {
    const arazzoFilePath = path.join(__dirname, 'fixtures', 'arazzo', 'sample-arazzo.yaml');
    const docArazzoYaml: TextDocument = TextDocument.create(
      pathToFileURL(arazzoFilePath).toString(),
      'yaml',
      0,
      specArazzoYaml101,
    );

    // Enable source descriptions resolution with file allow list
    const result = await parse(
      docArazzoYaml,
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
