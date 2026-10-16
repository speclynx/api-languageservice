import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assert } from 'chai';
import YAML from 'yaml';
import type { ErrorObject } from 'ajv';
import originalBetterAjvErrors from '@stoplight/better-ajv-errors';

import { betterAjvErrors } from '../src/services/validation/providers/better-errors/index.ts';
import { getByPointer } from '../src/services/validation/providers/better-errors/json-pointer.ts';
import { levenshtein } from '../src/services/validation/providers/better-errors/levenshtein.ts';
import { JsonSchemaValidateFunction } from '../src/services/validation/providers/json-schema-validation-provider.ts';
import validateOpenapi20 from '../src/services/validation/json-schema/validators/openapi-2-0.ts';
import validateOpenapi30 from '../src/services/validation/json-schema/validators/openapi-3-0.ts';
import validateOpenapi31 from '../src/services/validation/json-schema/validators/openapi-3-1.ts';
import validateAsyncapi20 from '../src/services/validation/json-schema/validators/asyncapi-2-0.ts';
import validateAsyncapi21 from '../src/services/validation/json-schema/validators/asyncapi-2-1.ts';
import validateAsyncapi22 from '../src/services/validation/json-schema/validators/asyncapi-2-2.ts';
import validateAsyncapi23 from '../src/services/validation/json-schema/validators/asyncapi-2-3.ts';
import validateAsyncapi24 from '../src/services/validation/json-schema/validators/asyncapi-2-4.ts';
import validateAsyncapi25 from '../src/services/validation/json-schema/validators/asyncapi-2-5.ts';
import validateAsyncapi26 from '../src/services/validation/json-schema/validators/asyncapi-2-6.ts';
import validateArazzo10 from '../src/services/validation/json-schema/validators/arazzo-1-0.ts';
import validateArazzo11 from '../src/services/validation/json-schema/validators/arazzo-1-1.ts';
import validateOverlay10 from '../src/services/validation/json-schema/validators/overlay-1-0.ts';
import validateOverlay11 from '../src/services/validation/json-schema/validators/overlay-1-1.ts';
import validateOverlay12 from '../src/services/validation/json-schema/validators/overlay-1-2.ts';
import { parsedFixtureDocuments } from './test-utils.ts';

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

const fixtureDocuments = parsedFixtureDocuments();

const embeddedSchemaValidators: [string, JsonSchemaValidateFunction][] = [
  ['openapi-2-0', validateOpenapi20],
  ['openapi-3-0', validateOpenapi30],
  ['openapi-3-1', validateOpenapi31],
  ['asyncapi-2-0', validateAsyncapi20],
  ['asyncapi-2-1', validateAsyncapi21],
  ['asyncapi-2-2', validateAsyncapi22],
  ['asyncapi-2-3', validateAsyncapi23],
  ['asyncapi-2-4', validateAsyncapi24],
  ['asyncapi-2-5', validateAsyncapi25],
  ['asyncapi-2-6', validateAsyncapi26],
  ['arazzo-1-0', validateArazzo10],
  ['arazzo-1-1', validateArazzo11],
  ['overlay-1-0', validateOverlay10],
  ['overlay-1-1', validateOverlay11],
  ['overlay-1-2', validateOverlay12],
];

// the errors the provider formats
const relevantErrors = (validateFunction: JsonSchemaValidateFunction, data: unknown) =>
  validateFunction(data)
    ? []
    : (validateFunction.errors ?? []).filter((error) => error.keyword !== 'if');

describe('api-languageservice-better-errors', function () {
  describe('betterAjvErrors', function () {
    embeddedSchemaValidators.forEach(([schemaName, validateFunction]) => {
      it(`formats the ${schemaName} errors of every fixture as the original does`, function () {
        this.timeout(20000);
        let formattedErrors = 0;
        fixtureDocuments.forEach(({ file, data }) => {
          const ajvErrors = relevantErrors(validateFunction, data);
          const ported = betterAjvErrors(ajvErrors, data);
          // the original ignores its first argument, the schema, and types the errors as Ajv's
          const original = originalBetterAjvErrors({}, ajvErrors as ErrorObject[], {
            propertyPath: [],
            targetValue: data,
          });
          assert.deepEqual(ported, original, file);
          formattedErrors += ported.length;
        });
        assert.isAbove(formattedErrors, 0);
      });
    });

    it('suggests the closest allowed value for a mistyped enum string', function () {
      const fixturePath = path.join(fixturesDirectory, 'json-schema-providers', 'openapi-3-0.yaml');
      const data = YAML.parse(fs.readFileSync(fixturePath, 'utf8'));
      const suggestions = betterAjvErrors(relevantErrors(validateOpenapi30, data), data)
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
        // shared prefixes and suffixes, which are trimmed before the row is computed
        ['prefix-abc-suffix', 'prefix-axc-suffix', 1],
        ['abc', 'abcdef', 3],
        ['def', 'abcdef', 3],
        ['ab', 'aXb', 1],
        ['aab', 'ab', 1],
        ['aaaa', 'aa', 2],
      ].forEach(([source, target, distance]) => {
        assert.strictEqual(levenshtein(source as string, target as string), distance);
        assert.strictEqual(levenshtein(target as string, source as string), distance);
      });
    });

    it('counts UTF-16 code units, as JavaScript strings do', function () {
      assert.strictEqual(levenshtein('a😀', 'a'), 2);
      assert.strictEqual(levenshtein('😀', '😁'), 1);
    });

    it('agrees with the full table of edit distances on random strings', function () {
      // the definition, one table cell per pair of prefixes
      const tableDistance = (source: string, target: string): number => {
        const table = Array.from({ length: source.length + 1 }, (_, sourceIndex) =>
          Array.from({ length: target.length + 1 }, (__, targetIndex) =>
            sourceIndex === 0 ? targetIndex : sourceIndex,
          ),
        );
        for (let sourceIndex = 1; sourceIndex <= source.length; sourceIndex += 1) {
          for (let targetIndex = 1; targetIndex <= target.length; targetIndex += 1) {
            table[sourceIndex][targetIndex] = Math.min(
              table[sourceIndex - 1][targetIndex] + 1,
              table[sourceIndex][targetIndex - 1] + 1,
              table[sourceIndex - 1][targetIndex - 1] +
                (source[sourceIndex - 1] === target[targetIndex - 1] ? 0 : 1),
            );
          }
        }
        return table[source.length][target.length];
      };
      // a fixed-seed generator, so a failure reproduces
      let seed = 42;
      const randomBelow = (bound: number) => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return Math.floor((seed / 2147483648) * bound);
      };
      // code units of 'ab😀', so lone surrogate halves come up too
      const randomString = (maxLength: number) =>
        Array.from({ length: randomBelow(maxLength + 1) }, () => 'ab😀'[randomBelow(4)]).join('');
      for (let pair = 0; pair < 2000; pair += 1) {
        const [prefix, suffix] = [randomString(3), randomString(3)];
        const source = prefix + randomString(6) + suffix;
        const target = prefix + randomString(6) + suffix;
        assert.strictEqual(levenshtein(source, target), tableDistance(source, target), source);
        assert.strictEqual(levenshtein(target, source), tableDistance(source, target), target);
      }
    });
  });
});
