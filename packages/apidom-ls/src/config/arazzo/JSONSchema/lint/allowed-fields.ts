import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

// JSON Schema 2020-12 allowed fields for Arazzo inputs
const allowedFieldsLint: LinterMeta = {
  code: ApilintCodes.NOT_ALLOWED_FIELDS,
  source: 'apilint',
  message: 'Object includes not allowed fields',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'allowedFields',
  linterParams: [
    [
      // Core vocabulary
      '$id',
      '$schema',
      '$ref',
      '$anchor',
      '$dynamicRef',
      '$dynamicAnchor',
      '$vocabulary',
      '$comment',
      '$defs',
      // Applicator vocabulary
      'allOf',
      'anyOf',
      'oneOf',
      'not',
      'if',
      'then',
      'else',
      'dependentSchemas',
      'prefixItems',
      'items',
      'contains',
      'properties',
      'patternProperties',
      'additionalProperties',
      'propertyNames',
      'unevaluatedItems',
      'unevaluatedProperties',
      // Validation vocabulary
      'type',
      'const',
      'enum',
      'multipleOf',
      'maximum',
      'exclusiveMaximum',
      'minimum',
      'exclusiveMinimum',
      'maxLength',
      'minLength',
      'pattern',
      'maxItems',
      'minItems',
      'uniqueItems',
      'maxContains',
      'minContains',
      'maxProperties',
      'minProperties',
      'required',
      'dependentRequired',
      // Format vocabulary
      'format',
      // Content vocabulary
      'contentEncoding',
      'contentMediaType',
      'contentSchema',
      // Meta-Data vocabulary
      'title',
      'description',
      'default',
      'deprecated',
      'readOnly',
      'writeOnly',
      'examples',
      // Compatibility (draft-07 / OpenAPI)
      'definitions',
      'dependencies',
      'additionalItems',
      'example',
    ],
  ],
  marker: 'key',
  targetSpecs: [...arazzo],
};

export default allowedFieldsLint;
