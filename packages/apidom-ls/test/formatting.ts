import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { fileURLToPath } from 'node:url';

import getLanguageService from '../src/apidom-language-service.ts';
import { LanguageService, LanguageServiceContext } from '../src/apidom-language-types.ts';
import { metadata } from './metadata.ts';
import { OpenAPi31JsonSchemaValidationProvider } from '../src/services/validation/providers/openapi-31-json-schema-validation-provider.ts';
import { logLevel, logPerformance } from './test-utils.ts';
import testTokens from './test-tokens.ts';
import { FormattingOptions } from 'vscode-languageserver-types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('formatting', function () {
  const metadataOas = JSON.parse(JSON.stringify(metadata()));
  const oasJsonSchemavalidationProvider = new OpenAPi31JsonSchemaValidationProvider();
  const context: LanguageServiceContext = {
    metadata: metadataOas,
    validatorProviders: [oasJsonSchemavalidationProvider],
    validationContext: {
      semanticValidation: true,
      semanticLinting: true,
      jsonSchemaValidation: true,
      referenceValidation: true,
    },
    performanceLogs: logPerformance,
    logLevel,
  };

  context.metadata!.tokens = testTokens;

  const languageService: LanguageService = getLanguageService(context);

  after(function () {
    languageService.terminate();
  });

  it('should format YAML', async function () {
    const specYamlValid = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'formatting', 'valid-yaml.yaml'))
      .toString();

    const specExpectedYaml = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'formatting', 'expected-valid-yaml.yaml'))
      .toString();

    const doc: TextDocument = TextDocument.create(
      'foo://bar/validYaml.yaml',
      'yaml',
      0,
      specYamlValid,
    );

    const formattingOptions: FormattingOptions = {
      tabSize: 4,
      insertSpaces: true,
    };

    const result = await languageService.doFormatting(doc, formattingOptions);
    assert.equal(result[0].newText, specExpectedYaml);
  });

  it('should format JSON', async function () {
    const specJsonValid = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'formatting', 'valid-json.json'))
      .toString();

    const specExpectedJson = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'formatting', 'expected-valid-json.json'))
      .toString();

    const doc: TextDocument = TextDocument.create(
      'foo://bar/validJson.json',
      'json',
      0,
      specJsonValid,
    );

    const formattingOptions: FormattingOptions = {
      tabSize: 4,
      insertSpaces: true,
    };

    const result = await languageService.doFormatting(doc, formattingOptions);
    assert.equal(result[0].newText, specExpectedJson);
  });
});
