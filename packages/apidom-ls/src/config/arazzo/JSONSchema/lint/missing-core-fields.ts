import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

// eslint-disable-next-line @typescript-eslint/naming-convention
const missingCoreFieldsLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_MISSING_CORE_FIELDS,
  source: 'apilint',
  message: 'Schema does not include any Schema Object keywords',
  severity: DiagnosticSeverity.Hint,
  linterFunction: 'existAnyOfFields',
  linterParams: [
    [
      // Core vocabulary
      '$ref',
      '$schema',
      '$id',
      '$vocabulary',
      '$anchor',
      '$dynamicAnchor',
      '$dynamicRef',
      '$defs',
      '$comment',
      // Applicator vocabulary
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
      // Compatibility
      'definitions',
      'dependencies',
      'additionalItems',
      'example',
      'allOf',
      'anyOf',
      'oneOf',
      'not',
    ],
    true,
  ],
  marker: 'key',
  conditions: [
    {
      function: 'apilintElementOrClass',
      params: [['JSONSchema']],
    },
  ],
  targetSpecs: Arazzo,
};

export default missingCoreFieldsLint;
