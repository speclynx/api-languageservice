import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver-types';
import { fileURLToPath } from 'node:url';

import getLanguageService from '../src/apidom-language-service.ts';
import {
  LanguageServiceContext,
  ValidationContext,
  ValidationProvider,
} from '../src/apidom-language-types.ts';
import { metadata } from './metadata.ts';
import { logLevel, logPerformance } from './test-utils.ts';
import { OpenAPi20JsonSchemaValidationProvider } from '../src/services/validation/providers/openapi-20-json-schema-validation-provider.ts';
import { OpenAPi30JsonSchemaValidationProvider } from '../src/services/validation/providers/openapi-30-json-schema-validation-provider.ts';
import { OpenAPi31JsonSchemaValidationProvider } from '../src/services/validation/providers/openapi-31-json-schema-validation-provider.ts';
import { Asyncapi20JsonSchemaValidationProvider } from '../src/services/validation/providers/asyncapi-20-json-schema-validation-provider.ts';
import { Asyncapi21JsonSchemaValidationProvider } from '../src/services/validation/providers/asyncapi-21-json-schema-validation-provider.ts';
import { Asyncapi22JsonSchemaValidationProvider } from '../src/services/validation/providers/asyncapi-22-json-schema-validation-provider.ts';
import { Asyncapi23JsonSchemaValidationProvider } from '../src/services/validation/providers/asyncapi-23-json-schema-validation-provider.ts';
import { Asyncapi24JsonSchemaValidationProvider } from '../src/services/validation/providers/asyncapi-24-json-schema-validation-provider.ts';
import { Asyncapi25JsonSchemaValidationProvider } from '../src/services/validation/providers/asyncapi-25-json-schema-validation-provider.ts';
import { Asyncapi26JsonSchemaValidationProvider } from '../src/services/validation/providers/asyncapi-26-json-schema-validation-provider.ts';
import { Arazzo1JsonSchemaValidationProvider } from '../src/services/validation/providers/arazzo-1-json-schema-validation-provider.ts';
import { Arazzo11JsonSchemaValidationProvider } from '../src/services/validation/providers/arazzo-11-json-schema-validation-provider.ts';
import { Overlay1JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-1-json-schema-validation-provider.ts';
import { Overlay10JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-10-json-schema-validation-provider.ts';
import { Overlay11JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-11-json-schema-validation-provider.ts';
import { Overlay12JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-12-json-schema-validation-provider.ts';

/*
Pins the diagnostics every JSON Schema validation provider produces for an invalid document, in
JSON and YAML, with and without `betterAjvErrors`. The expected files were recorded from the
runtime Ajv implementation; any change to how the embedded schemas are compiled or how their
errors are reported must leave them untouched unless the change is meant to alter diagnostics.
To re-record after an intended change, run the suite with `RECORD_EXPECTED=true` and review the
diff of `fixtures/expected/json-schema-providers`.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDirectory = path.join(__dirname, 'fixtures', 'json-schema-providers');
const expectedDirectory = path.join(__dirname, 'fixtures', 'expected', 'json-schema-providers');
const recordExpected = process.env.RECORD_EXPECTED === 'true';

interface ProviderCase {
  fixture: string;
  expected: string;
  createProvider: () => ValidationProvider;
}

type FormatDiagnostics = Record<'default' | 'betterAjvErrors', Diagnostic[]>;
type CaseDiagnostics = Record<'json' | 'yaml', FormatDiagnostics>;

const versionSpecificCase = (
  fixture: string,
  createProvider: () => ValidationProvider,
): ProviderCase => ({ fixture, expected: fixture, createProvider });

const providerCases: ProviderCase[] = [
  versionSpecificCase('openapi-2-0', () => new OpenAPi20JsonSchemaValidationProvider()),
  versionSpecificCase('openapi-3-0', () => new OpenAPi30JsonSchemaValidationProvider()),
  versionSpecificCase('openapi-3-1', () => new OpenAPi31JsonSchemaValidationProvider()),
  versionSpecificCase(
    'openapi-3-1-without-paths',
    () => new OpenAPi31JsonSchemaValidationProvider(),
  ),
  // keys holding `~` and `/` (escaped as `~0` and `~1` in JSON Pointers), and an array item
  versionSpecificCase(
    'openapi-3-1-pointer-escapes',
    () => new OpenAPi31JsonSchemaValidationProvider(),
  ),
  // the openapi-3-1 document with its JSON indented by tabs, which ranges count as one character
  versionSpecificCase(
    'openapi-3-1-tab-indented',
    () => new OpenAPi31JsonSchemaValidationProvider(),
  ),
  // a duplicated key: Ajv validates the occurrence `JSON.parse` keeps, the last one
  versionSpecificCase(
    'openapi-3-1-duplicate-keys',
    () => new OpenAPi31JsonSchemaValidationProvider(),
  ),
  versionSpecificCase('asyncapi-2-0', () => new Asyncapi20JsonSchemaValidationProvider()),
  versionSpecificCase('asyncapi-2-1', () => new Asyncapi21JsonSchemaValidationProvider()),
  versionSpecificCase('asyncapi-2-2', () => new Asyncapi22JsonSchemaValidationProvider()),
  versionSpecificCase('asyncapi-2-3', () => new Asyncapi23JsonSchemaValidationProvider()),
  versionSpecificCase('asyncapi-2-4', () => new Asyncapi24JsonSchemaValidationProvider()),
  versionSpecificCase('asyncapi-2-5', () => new Asyncapi25JsonSchemaValidationProvider()),
  versionSpecificCase('asyncapi-2-6', () => new Asyncapi26JsonSchemaValidationProvider()),
  versionSpecificCase('arazzo-1-0', () => new Arazzo1JsonSchemaValidationProvider()),
  versionSpecificCase('arazzo-1-1', () => new Arazzo11JsonSchemaValidationProvider()),
  versionSpecificCase('overlay-1-0', () => new Overlay10JsonSchemaValidationProvider()),
  versionSpecificCase('overlay-1-1', () => new Overlay11JsonSchemaValidationProvider()),
  versionSpecificCase('overlay-1-2', () => new Overlay12JsonSchemaValidationProvider()),
  // the deprecated Overlay 1 provider picks the schema matching the document's version
  ...['overlay-1-0', 'overlay-1-1', 'overlay-1-2'].map((fixture) => ({
    fixture,
    expected: `${fixture}.deprecated-overlay-1-provider`,
    createProvider: () => new Overlay1JsonSchemaValidationProvider(),
  })),
];

// one diagnostic per line keeps the expected files short and their diffs readable
const serializeDiagnostics = (diagnostics: Diagnostic[]): string =>
  diagnostics.length === 0
    ? '[]'
    : `[\n${diagnostics.map((diagnostic) => `      ${JSON.stringify(diagnostic)}`).join(',\n')}\n    ]`;

const serializeExpected = (caseDiagnostics: CaseDiagnostics): string => {
  const formatSections = (['json', 'yaml'] as const).map((format) =>
    [
      `  "${format}": {`,
      `    "default": ${serializeDiagnostics(caseDiagnostics[format].default)},`,
      `    "betterAjvErrors": ${serializeDiagnostics(caseDiagnostics[format].betterAjvErrors)}`,
      '  }',
    ].join('\n'),
  );
  return `{\n${formatSections.join(',\n')}\n}\n`;
};

const validateWithProvider = async (
  provider: ValidationProvider,
  format: 'json' | 'yaml',
  fixture: string,
): Promise<FormatDiagnostics> => {
  const context: LanguageServiceContext = {
    metadata: metadata(),
    validatorProviders: [provider],
    validationContext: {
      jsonSchemaValidation: true,
      semanticValidation: true,
      referenceValidation: true,
      semanticLinting: true,
    },
    performanceLogs: logPerformance,
    logLevel,
  };
  const languageService = getLanguageService(context);
  const text = fs.readFileSync(path.join(fixturesDirectory, `${fixture}.${format}`), 'utf8');
  const document = TextDocument.create(`foo://bar/${fixture}.${format}`, format, 0, text);
  // only the provider's own diagnostics; the semantic rules have their own tests
  const providerDiagnostics = async (betterAjvErrors: boolean): Promise<Diagnostic[]> => {
    const validationContext: ValidationContext = { betterAjvErrors };
    const diagnostics = await languageService.doValidation(document, validationContext);
    return diagnostics.filter((diagnostic) => diagnostic.source === provider.name());
  };
  try {
    return {
      default: await providerDiagnostics(false),
      betterAjvErrors: await providerDiagnostics(true),
    };
  } finally {
    languageService.terminate();
  }
};

describe('api-languageservice-json-schema-providers', function () {
  providerCases.forEach(({ fixture, expected, createProvider }) => {
    it(`${expected} diagnostics match the recorded baseline`, async function () {
      const provider = createProvider();
      const actual: CaseDiagnostics = {
        json: await validateWithProvider(provider, 'json', fixture),
        yaml: await validateWithProvider(provider, 'yaml', fixture),
      };
      const expectedPath = path.join(expectedDirectory, `${expected}.json`);
      if (recordExpected) {
        fs.mkdirSync(expectedDirectory, { recursive: true });
        fs.writeFileSync(expectedPath, serializeExpected(actual));
      }
      assert.deepEqual(actual, JSON.parse(fs.readFileSync(expectedPath, 'utf8')));
    });
  });
});
