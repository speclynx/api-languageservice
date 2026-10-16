import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assert } from 'chai';
import YAML from 'yaml';
import originalBetterAjvErrors from '@stoplight/better-ajv-errors';

import { betterAjvErrors } from '../src/services/validation/providers/better-errors/index.ts';
import { getByPointer } from '../src/services/validation/providers/better-errors/json-pointer.ts';
import { levenshtein } from '../src/services/validation/providers/better-errors/levenshtein.ts';
import { compileAjv } from '../src/services/validation/providers/ajv-utils.ts';
import { JsonSchemaValidationProvider } from '../src/services/validation/providers/json-schema-validation-provider.ts';
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
import { Overlay10JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-10-json-schema-validation-provider.ts';
import { Overlay11JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-11-json-schema-validation-provider.ts';
import { Overlay12JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-12-json-schema-validation-provider.ts';

/*
The formatter in `src/services/validation/providers/better-errors` is a port of
@stoplight/better-ajv-errors, which stays a devDependency to be the oracle here. The provider
baselines cannot pin the port alone: the provider drops `suggestion`, the only output the JSON
Pointer lookup feeds. So every fixture document is validated against every embedded schema, which
yields errors of every shape the schemas can report, and the port has to return exactly what the
original returns, `suggestion` included.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDirectory = path.join(__dirname, 'fixtures');

// the parsed data the provider validates; documents that do not parse are skipped
const fixtureDocuments = fs
  .readdirSync(fixturesDirectory, { recursive: true, encoding: 'utf8' })
  .filter((file) => /\.(json|ya?ml)$/.test(file))
  .flatMap((file) => {
    const text = fs.readFileSync(path.join(fixturesDirectory, file), 'utf8');
    try {
      const data = file.endsWith('.json')
        ? JSON.parse(text)
        : JSON.parse(JSON.stringify(YAML.parse(text, { logLevel: 'silent' })));
      return [{ file, data }];
    } catch {
      return [];
    }
  });

const embeddedSchemaProviders: [string, JsonSchemaValidationProvider][] = [
  ['openapi-2-0', new OpenAPi20JsonSchemaValidationProvider()],
  ['openapi-3-0', new OpenAPi30JsonSchemaValidationProvider()],
  ['openapi-3-1', new OpenAPi31JsonSchemaValidationProvider()],
  ['asyncapi-2-0', new Asyncapi20JsonSchemaValidationProvider()],
  ['asyncapi-2-1', new Asyncapi21JsonSchemaValidationProvider()],
  ['asyncapi-2-2', new Asyncapi22JsonSchemaValidationProvider()],
  ['asyncapi-2-3', new Asyncapi23JsonSchemaValidationProvider()],
  ['asyncapi-2-4', new Asyncapi24JsonSchemaValidationProvider()],
  ['asyncapi-2-5', new Asyncapi25JsonSchemaValidationProvider()],
  ['asyncapi-2-6', new Asyncapi26JsonSchemaValidationProvider()],
  ['arazzo-1-0', new Arazzo1JsonSchemaValidationProvider()],
  ['arazzo-1-1', new Arazzo11JsonSchemaValidationProvider()],
  ['overlay-1-0', new Overlay10JsonSchemaValidationProvider()],
  ['overlay-1-1', new Overlay11JsonSchemaValidationProvider()],
  ['overlay-1-2', new Overlay12JsonSchemaValidationProvider()],
];

// the schema a provider embeds, and the errors the provider formats for a document
const providerValidation = (provider: JsonSchemaValidationProvider) => {
  const { jsonSchema, ajv2020 } = provider as unknown as {
    jsonSchema: Record<string, unknown>;
    ajv2020: boolean;
  };
  const validateFunction = compileAjv(jsonSchema, ajv2020);
  return {
    jsonSchema,
    relevantErrors: (data: unknown) =>
      validateFunction(data)
        ? []
        : (validateFunction.errors ?? []).filter((error) => error.keyword !== 'if'),
  };
};

describe('api-languageservice-better-errors', function () {
  describe('betterAjvErrors', function () {
    embeddedSchemaProviders.forEach(([schemaName, provider]) => {
      it(`formats the ${schemaName} errors of every fixture as the original does`, function () {
        this.timeout(20000);
        const { jsonSchema, relevantErrors } = providerValidation(provider);
        let formattedErrors = 0;
        fixtureDocuments.forEach(({ file, data }) => {
          const ajvErrors = relevantErrors(data);
          const ported = betterAjvErrors(ajvErrors, data);
          assert.deepEqual(
            ported,
            originalBetterAjvErrors(jsonSchema, ajvErrors, { propertyPath: [], targetValue: data }),
            file,
          );
          formattedErrors += ported.length;
        });
        assert.isAbove(formattedErrors, 0);
      });
    });

    it('suggests the closest allowed value for a mistyped enum string', function () {
      const { relevantErrors } = providerValidation(new OpenAPi30JsonSchemaValidationProvider());
      const fixturePath = path.join(fixturesDirectory, 'json-schema-providers', 'openapi-3-0.yaml');
      const data = YAML.parse(fs.readFileSync(fixturePath, 'utf8'));
      const suggestions = betterAjvErrors(relevantErrors(data), data)
        .filter((error) => error.suggestion !== undefined)
        .map(({ path: instancePath, suggestion }) => ({ instancePath, suggestion }));
      // the first pointer holds an escaped `/`
      assert.deepEqual(suggestions, [
        { instancePath: '/paths/~1pets/get/parameters/0/in', suggestion: 'Did you mean "query"?' },
        {
          instancePath: '/components/securitySchemes/key/type',
          suggestion: 'Did you mean "apiKey"?',
        },
      ]);
    });
  });

  describe('getByPointer', function () {
    const document = JSON.parse(`{
      "items": [10, 20, null],
      "nothing": null,
      "text": "abc",
      "a/b": 1,
      "m~n": 2,
      "~1": 3,
      "": 4,
      "__proto__": 5,
      "nested": { "constructor": 6 }
    }`);

    it('resolves the root pointer to the whole document', function () {
      assert.strictEqual(getByPointer(document, ''), document);
    });

    it('resolves keys, escaped keys and array indexes', function () {
      assert.strictEqual(getByPointer(document, '/items/1'), 20);
      assert.strictEqual(getByPointer(document, '/items/2'), null);
      assert.strictEqual(getByPointer(document, '/nothing'), null);
      assert.strictEqual(getByPointer(document, '/a~1b'), 1);
      assert.strictEqual(getByPointer(document, '/m~0n'), 2);
      assert.strictEqual(getByPointer(document, '/~01'), 3);
      assert.strictEqual(getByPointer(document, '/'), 4);
    });

    it('resolves own keys named after Object.prototype members', function () {
      assert.strictEqual(getByPointer(document, '/__proto__'), 5);
      assert.strictEqual(getByPointer(document, '/nested/constructor'), 6);
    });

    it('returns undefined where the pointer points to nothing', function () {
      [
        '/missing',
        '/items/3',
        '/items/01',
        '/items/-',
        '/items/first',
        '/items/length',
        '/nothing/key',
        '/text/length',
        '/items/0/key',
        // inherited, not own
        '/constructor',
        '/nested/toString',
      ].forEach((jsonPointer) => {
        assert.isUndefined(getByPointer(document, jsonPointer), jsonPointer);
      });
    });

    it('throws on a malformed pointer', function () {
      assert.throws(() => getByPointer(document, 'items'));
      assert.throws(() => getByPointer(document, '/m~2n'));
    });
  });

  describe('levenshtein', function () {
    it('counts the fewest edits between two strings', function () {
      [
        ['', '', 0],
        ['', 'abc', 3],
        ['same', 'same', 0],
        ['kitten', 'sitting', 3],
        ['flaw', 'lawn', 2],
        ['querry', 'query', 1],
        ['htps', 'https', 1],
        ['apiKeyy', 'apiKey', 1],
        ['oauth2', 'openIdConnect', 12],
      ].forEach(([source, target, distance]) => {
        assert.strictEqual(levenshtein(source as string, target as string), distance);
        assert.strictEqual(levenshtein(target as string, source as string), distance);
      });
    });

    it('counts UTF-16 code units, as JavaScript strings do', function () {
      assert.strictEqual(levenshtein('a😀', 'a'), 2);
      assert.strictEqual(levenshtein('😀', '😁'), 1);
    });
  });
});
