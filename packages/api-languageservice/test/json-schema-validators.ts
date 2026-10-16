import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assert } from 'chai';

import { JsonSchemaValidateFunction } from '../src/services/validation/providers/json-schema-validation-provider.ts';
import {
  compileJsonSchemaValidator,
  jsonSchemaValidators,
} from '../scripts/generate-json-schema-validators.mjs';
import { parsedFixtureDocuments } from './test-utils.ts';

/*
The providers validate with functions Ajv's standalone code generator wrote ahead of time (see
`scripts/generate-json-schema-validators.mjs`). Every fixture document goes through each of them
and through the same schema compiled by Ajv at runtime with the same options, and both have to
reach the same verdict with the same errors. Each document is checked against every schema, not
only the one for its version, which gives errors of every kind the schemas can report; every schema
also gets valid documents, `fixtures/json-schema-validators` holding one for the two versions no
other fixture covers.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const validatorsDirectory = path.join(
  __dirname,
  '..',
  'src',
  'services',
  'validation',
  'json-schema',
  'validators',
);
const fixtureDocuments = parsedFixtureDocuments();

describe('api-languageservice-json-schema-validators', function () {
  jsonSchemaValidators.forEach(({ name }) => {
    it(`the generated ${name} validator agrees with Ajv on every fixture`, async function () {
      this.timeout(20000);
      // the compiled module of the generated TypeScript, which mocha runs
      const generatedModule = pathToFileURL(path.join(validatorsDirectory, `${name}.mjs`));
      const generated: JsonSchemaValidateFunction = (await import(generatedModule.href)).default;
      const { validateFunction: runtime } = compileJsonSchemaValidator(name);
      let validDocuments = 0;
      fixtureDocuments.forEach(({ file, data }) => {
        const valid = generated(data);
        assert.strictEqual(valid, runtime(data), file);
        assert.deepEqual(generated.errors, runtime.errors, file);
        validDocuments += valid ? 1 : 0;
      });
      assert.isAbove(validDocuments, 0, 'no valid document');
      assert.isBelow(validDocuments, fixtureDocuments.length, 'no invalid document');
    });
  });
});
