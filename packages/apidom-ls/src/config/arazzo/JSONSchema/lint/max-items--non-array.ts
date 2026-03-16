import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const maxItemsNonArrayLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_MAXITEMS_NONARRAY,
  source: 'apilint',
  message: 'maxItems has no effect on non arrays',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'missingField',
  linterParams: ['maxItems'],
  marker: 'key',
  markerTarget: 'maxItems',
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
        message: 'remove maxItems',
        action: 'removeChild',
        functionParams: ['maxItems'],
        target: 'parent',
      },
    ],
  },
  targetSpecs: Arazzo,
};

export default maxItemsNonArrayLint;
