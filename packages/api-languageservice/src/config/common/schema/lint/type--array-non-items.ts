import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../../arazzo/target-specs.ts';
import { AsyncAPI2 } from '../../../asyncapi/target-specs.ts';
import { OpenAPI3 } from '../../../openapi/target-specs.ts';

const typeArrayNonItemsLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_TYPE_ARRAY_NON_ITEMS,
  source: 'apilint',
  message: 'Schemas with "type: array" require a sibling "items" field',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['items'],
  marker: 'key',
  markerTarget: 'type',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintContainsValue',
      params: ['array'],
    },
  ],
  targetSpecs: [...AsyncAPI2, ...OpenAPI3, ...Arazzo],
};

export default typeArrayNonItemsLint;
