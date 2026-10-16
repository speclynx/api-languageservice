/*
 * Compiles the JSON Schemas the validation providers check documents against into standalone
 * validation functions, so that the published package runs no Ajv: Ajv, ajv-errors and
 * ajv-formats are devDependencies, used here only. The functions are generated into
 * src/services/validation/json-schema/validators and committed; CI runs this script again and
 * fails when the output differs. Run it with `npm run generate:validators` after changing a
 * schema or upgrading ajv, ajv-errors or ajv-formats.
 *
 * Ajv's standalone code loads two helpers of its own at runtime, `equal` (fast-deep-equal) and
 * `ucs2length`. They are vendored into src/services/validation/json-schema/runtime and the
 * generated code imports them from there; any other runtime dependency fails the generation.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import Ajv2020 from 'ajv/dist/2020.js';
import standaloneCode from 'ajv/dist/standalone/index.js';
import ajvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsonSchemaDirectory = path.join(packageDirectory, 'src/services/validation/json-schema');
const validatorsDirectory = path.join(jsonSchemaDirectory, 'validators');

const readSchema = (schemaFile) =>
  JSON.parse(fs.readFileSync(path.join(jsonSchemaDirectory, schemaFile), 'utf8'));

// `code.lines` only adds line breaks, which keep the committed output reviewable
const commonOptions = {
  strict: false,
  allErrors: true,
  validateFormats: false,
  unicodeRegExp: false,
  code: { source: true, esm: true, lines: true },
};

const ajvFactories = {
  'draft-2020-12': () => {
    const ajv = new Ajv2020({
      ...commonOptions,
      messages: true,
      inlineRefs: false,
      schemas: [
        'open-api-31/spectral/openapi-schema-2021-09-29-spectral.json',
        'open-api-31/spectral/openapi-schema-meta-spectral.json',
        'open-api-31/spectral/openapi-schema-dialect-spectral.json',
        'open-api-31/spectral/draft-2020-12/index.json',
        'open-api-31/spectral/draft-2020-12/validation.json',
        'open-api-31/spectral/draft-04.json',
      ].map(readSchema),
    });
    addFormats(ajv);
    ajv.addFormat('media-range', true);
    ajvErrors(ajv);
    return ajv;
  },
  'draft-07': () => {
    const ajv = new Ajv({ ...commonOptions, meta: true });
    ajvErrors(ajv);
    return ajv;
  },
  /*
   * The AsyncAPI 2.3 to 2.6 schemas bundle their own copy of the draft-07 meta-schema, under the
   * `$id` Ajv registers for its built-in copy, so they are compiled without the built-in one.
   */
  'draft-07-bundled-meta-schema': () => {
    const ajv = new Ajv({ ...commonOptions, meta: false, validateSchema: false });
    ajvErrors(ajv);
    return ajv;
  },
};

export const jsonSchemaValidators = [
  ['openapi-2-0', 'open-api-20/openapi-schema-draft-2020-12-spectral.json', 'draft-2020-12'],
  [
    'openapi-3-0',
    'open-api-30/openapi-schema-2019-04-02-draft-2020-12-spectral.json',
    'draft-2020-12',
  ],
  ['openapi-3-1', 'open-api-31/spectral/openapi-schema-2021-09-29-spectral.json', 'draft-2020-12'],
  ['asyncapi-2-0', 'async-api-20/asyncapi-schema.json', 'draft-07'],
  ['asyncapi-2-1', 'async-api-21/asyncapi-schema.json', 'draft-07'],
  ['asyncapi-2-2', 'async-api-22/asyncapi-schema.json', 'draft-07'],
  ['asyncapi-2-3', 'async-api-23/asyncapi-schema.json', 'draft-07-bundled-meta-schema'],
  ['asyncapi-2-4', 'async-api-24/asyncapi-schema.json', 'draft-07-bundled-meta-schema'],
  ['asyncapi-2-5', 'async-api-25/asyncapi-schema.json', 'draft-07-bundled-meta-schema'],
  ['asyncapi-2-6', 'async-api-26/asyncapi-schema.json', 'draft-07-bundled-meta-schema'],
  ['arazzo-1-0', 'arazzo-1/arazzo-schema-2025-10-15.json', 'draft-2020-12'],
  ['arazzo-1-1', 'arazzo-11/arazzo-schema-2026-04-15.json', 'draft-2020-12'],
  ['overlay-1-0', 'overlay-1/overlay-1.0-schema.json', 'draft-2020-12'],
  ['overlay-1-1', 'overlay-1/overlay-1.1-schema.json', 'draft-2020-12'],
  ['overlay-1-2', 'overlay-1/overlay-1.2-schema.json', 'draft-2020-12'],
].map(([name, schemaFile, dialect]) => ({ name, schemaFile, dialect }));

/**
 * Compiles the validator `name` with Ajv, as the generated code does it, and returns the Ajv
 * instance with the validation function. Each validator gets an instance of its own.
 */
export const compileJsonSchemaValidator = (name) => {
  const { schemaFile, dialect } = jsonSchemaValidators.find((validator) => validator.name === name);
  const ajv = ajvFactories[dialect]();
  const jsonSchema = readSchema(schemaFile);
  const schemaId = jsonSchema.$id ?? jsonSchema.id;
  // the OpenAPI 3.1 schema is also one the 2020-12 instance loads up front
  const validateFunction = (schemaId && ajv.getSchema(schemaId)) || ajv.compile(jsonSchema);
  return { ajv, validateFunction };
};

const runtimeHelpers = [
  ['require("ajv/dist/runtime/equal").default', 'equal'],
  ['require("ajv/dist/runtime/ucs2length").default', 'ucs2length'],
];

const generatedModule = ({ name, schemaFile }) => {
  const { ajv, validateFunction } = compileJsonSchemaValidator(name);
  let code = standaloneCode(ajv, validateFunction);
  const imports = [];
  for (const [ajvRequire, helper] of runtimeHelpers) {
    if (code.includes(ajvRequire)) {
      code = code.replaceAll(ajvRequire, helper);
      imports.push(`import { ${helper} } from '../runtime/${helper}.ts';`);
    }
  }
  if (/\brequire\(|ajv\/dist/.test(code)) {
    throw new Error(`The ${name} validator needs a runtime helper that is not vendored.`);
  }
  // the export is typed here, since the file itself is not type-checked
  code = code
    .replace(/^"use strict";\n/, '')
    .replace(/^export const validate = (\w+);\nexport default \1;\n/, (_, validateName) => {
      imports.push(
        "import type { JsonSchemaValidateFunction } from '../../providers/json-schema-validation-provider.ts';",
      );
      return `const validate: JsonSchemaValidateFunction = ${validateName};\nexport default validate;\n`;
    });
  if (!code.includes('export default validate;')) {
    throw new Error(`The ${name} validator does not start with the exports Ajv generates.`);
  }
  return [
    '// @ts-nocheck',
    '/* eslint-disable */',
    `// Generated by scripts/generate-json-schema-validators.mjs from json-schema/${schemaFile}.`,
    '// Do not edit: run `npm run generate:validators` instead.',
    ...imports,
    '',
    code,
  ].join('\n');
};

if (import.meta.main) {
  const generatedFiles = jsonSchemaValidators.map(({ name }) => `${name}.ts`);
  fs.mkdirSync(validatorsDirectory, { recursive: true });
  // a validator whose schema left the list; the build output beside the sources stays
  for (const file of fs.readdirSync(validatorsDirectory)) {
    if (file.endsWith('.ts') && !generatedFiles.includes(file)) {
      fs.rmSync(path.join(validatorsDirectory, file));
    }
  }
  for (const validator of jsonSchemaValidators) {
    fs.writeFileSync(
      path.join(validatorsDirectory, `${validator.name}.ts`),
      generatedModule(validator),
    );
  }
}
