import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const uniqueItemsNonArrayLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_UNIQUEITEMS_NONARRAY,
  source: 'apilint',
  message: 'uniqueItems has no effect on non arrays',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'missingField',
  linterParams: ['uniqueItems'],
  marker: 'key',
  markerTarget: 'uniqueItems',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintContainsValue',
      negate: true,
      params: ['array'],
    },
  ],
  data: {
    quickFix: [
      {
        message: 'remove uniqueItems',
        action: 'removeChild',
        functionParams: ['uniqueItems'],
        target: 'parent',
      },
    ],
  },
  targetSpecs: Arazzo,
};

export default uniqueItemsNonArrayLint;
