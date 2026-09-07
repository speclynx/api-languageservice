import Ajv2020, * as Ajv2020Ns from 'ajv/dist/2020.js';
import type { Ajv2020 as Ajv2020Type } from 'ajv/dist/2020.d.ts';
import Ajv, * as AjvNs from 'ajv';
import type { Ajv as AjvType } from 'ajv';
import AjvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';

import { debug } from '../../../utils/utils.ts';
import openapiSchemaJson31 from '../json-schema/open-api-31/spectral/openapi-schema-2021-09-29-spectral.json' with { type: 'json' };
import openapiSchemaJson31Meta from '../json-schema/open-api-31/spectral/openapi-schema-meta-spectral.json' with { type: 'json' };
import openapiSchemaJson31Dialect from '../json-schema/open-api-31/spectral/openapi-schema-dialect-spectral.json' with { type: 'json' };
import draft202012Schema from '../json-schema/open-api-31/spectral/draft-2020-12/index.json' with { type: 'json' };
import draft202012SchemaValidation from '../json-schema/open-api-31/spectral/draft-2020-12/validation.json' with { type: 'json' };
import draft4Schema from '../json-schema/open-api-31/spectral/draft-04.json' with { type: 'json' };

let ajvInstance: AjvType;
let ajv2020Instance: Ajv2020Type;

export function ajv(ajv2020: boolean): Ajv2020Type | AjvType {
  if (!ajv2020Instance && ajv2020) {
    // @ts-ignore
    ajv2020Instance = new Ajv2020({
      strict: false,
      allErrors: true,
      messages: true,
      inlineRefs: false,
      validateFormats: false,
      unicodeRegExp: false,
      schemas: [
        openapiSchemaJson31,
        openapiSchemaJson31Meta,
        openapiSchemaJson31Dialect,
        draft202012Schema,
        draft202012SchemaValidation,
        draft4Schema,
      ],
      code: {
        esm: true,
        source: true,
      },
    });
    // @ts-ignore
    addFormats(ajv2020Instance);
    ajv2020Instance.addFormat('media-range', true);

    // @ts-ignore
    AjvErrors(ajv2020Instance);
  } else if (!ajvInstance && !ajv2020) {
    // @ts-ignore
    ajvInstance = new Ajv({
      strict: false,
      meta: true,
      allErrors: true,
      validateFormats: false,
      unicodeRegExp: false,
    });
    // @ts-ignore
    AjvErrors(ajvInstance);
  }

  if (ajv2020) {
    return ajv2020Instance;
  }
  return ajvInstance;
}

function getOrCompile(
  jsonSchema: Record<string, unknown>,
  ajv2020: boolean,
): Ajv2020Ns.ValidateFunction | AjvNs.ValidateFunction {
  const ajvInst = ajv2020 ? ajv2020Instance : ajvInstance;
  const schemaId = jsonSchema.$id || jsonSchema.id;
  if (schemaId && ajvInst.getSchema(schemaId as string)) {
    // @ts-ignore
    return ajvInst.getSchema(schemaId as string);
  }
  debug('Compiling JSON Schema', schemaId || 'no-id');
  return ajvInst.compile(jsonSchema);
}

export function compileAjv(
  jsonSchema: Record<string, unknown>,
  ajv2020: boolean,
  relatedSchemas?: Record<string, unknown>[],
): Ajv2020Ns.ValidateFunction | AjvNs.ValidateFunction {
  if (!ajv2020Instance && ajv2020) {
    debug('Creating new AJV 2020 instance');
    ajv(ajv2020);
  } else if (!ajvInstance && !ajv2020) {
    debug('Creating new AJV instance');
    ajv(ajv2020);
  }
  const ajvInst = ajv2020 ? ajv2020Instance : ajvInstance;
  const schemaId = jsonSchema.$id || jsonSchema.id;
  if (schemaId && ajvInst.getSchema(schemaId as string)) {
    // @ts-ignore
    return ajvInst.getSchema(schemaId as string);
  }
  if (relatedSchemas) {
    relatedSchemas.forEach((schema) => {
      getOrCompile(schema, ajv2020);
    });
  }
  return getOrCompile(jsonSchema, ajv2020);
}
