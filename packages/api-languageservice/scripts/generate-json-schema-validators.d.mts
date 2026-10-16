import type { JsonSchemaValidateFunction } from '../src/services/validation/providers/json-schema-validation-provider.ts';

export declare const jsonSchemaValidators: { name: string; schemaFile: string; dialect: string }[];

export declare const compileJsonSchemaValidator: (name: string) => {
  ajv: unknown;
  validateFunction: JsonSchemaValidateFunction;
};
