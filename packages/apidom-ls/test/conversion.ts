import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { fileURLToPath } from 'node:url';

import getLanguageService from '../src/apidom-language-service.ts';
import {
  ConversionOptions,
  Format,
  LanguageService,
  LanguageServiceContext,
} from '../src/apidom-language-types.ts';
import { metadata } from './metadata.ts';
import { OpenAPi31JsonSchemaValidationProvider } from '../src/services/validation/providers/openapi-31-json-schema-validation-provider.ts';
import { logLevel, logPerformance } from './test-utils.ts';
import testTokens from './test-tokens.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('conversion', function () {
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

  it('should convert into JSON', async function () {
    const specYamlValid = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'conversion', 'valid-yaml.yaml'))
      .toString();

    const specExpectedJson = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'conversion', 'expected-valid-json.json'))
      .toString();

    const doc: TextDocument = TextDocument.create(
      'foo://bar/validYaml.yaml',
      'yaml',
      0,
      specYamlValid,
    );

    const result = await languageService.doConversion(doc, Format.YAML, Format.JSON);
    assert.equal(result.result, specExpectedJson.substring(0, specExpectedJson.length - 1));
  });

  it('should convert into YAML', async function () {
    const specJsonValid = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'conversion', 'valid-json.json'))
      .toString();

    const specExpectedYaml = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'conversion', 'expected-valid-yaml.yaml'))
      .toString();

    const doc: TextDocument = TextDocument.create(
      'foo://bar/validJson.json',
      'json',
      0,
      specJsonValid,
    );

    const result = await languageService.doConversion(doc, Format.JSON, Format.YAML);
    assert.equal(result.result, specExpectedYaml);
  });

  it('should return success=false converting invalid doc into JSON', async function () {
    const specYamlInvalid = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'conversion', 'invalid-yaml.yaml'))
      .toString();

    const doc: TextDocument = TextDocument.create(
      'foo://bar/invalidYaml.yaml',
      'yaml',
      0,
      specYamlInvalid,
    );

    const result = await languageService.doConversion(doc, Format.YAML, Format.JSON);
    assert.isFalse(result.success, 'conversion should fail');
  });

  it('should return success=false converting invalid doc into YAML', async function () {
    const specJsonInvalid = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'conversion', 'invalid-json.json'))
      .toString();

    const doc: TextDocument = TextDocument.create(
      'foo://bar/invalidJson.json',
      'json',
      0,
      specJsonInvalid,
    );

    const result = await languageService.doConversion(doc, Format.JSON, Format.YAML);
    console.log(result.error);
    assert.isFalse(result.success, 'conversion should fail');
  });

  it('should convert into JSON with enhanced formatting', async function () {
    const specYamlValid = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'conversion', 'valid-yaml.yaml'))
      .toString();

    const specExpectedJson = fs
      .readFileSync(
        path.join(__dirname, 'fixtures', 'conversion', 'expected-valid-json-enhanced.json'),
      )
      .toString();

    const doc: TextDocument = TextDocument.create(
      'foo://bar/validYaml.yaml',
      'yaml',
      0,
      specYamlValid,
    );

    const conversionOptions: ConversionOptions = {
      enhancedFormatting: true,
      formattingOptions: {
        tabSize: 4,
        insertSpaces: true,
      },
    };

    const result = await languageService.doConversion(
      doc,
      Format.YAML,
      Format.JSON,
      conversionOptions,
    );
    assert.equal(result.result, specExpectedJson);
  });

  it('should convert into YAML with enhanced formatting', async function () {
    const specJsonValid = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'conversion', 'valid-json.json'))
      .toString();

    const specExpectedYaml = fs
      .readFileSync(
        path.join(__dirname, 'fixtures', 'conversion', 'expected-valid-yaml-enhanced.yaml'),
      )
      .toString();

    const doc: TextDocument = TextDocument.create(
      'foo://bar/validJson.json',
      'json',
      0,
      specJsonValid,
    );

    const conversionOptions: ConversionOptions = {
      enhancedFormatting: true,
      formattingOptions: {
        tabSize: 4,
        insertSpaces: true,
      },
    };

    const result = await languageService.doConversion(
      doc,
      Format.JSON,
      Format.YAML,
      conversionOptions,
    );
    assert.equal(result.result, specExpectedYaml);
  });
});
