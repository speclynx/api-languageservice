import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const containsNonArrayLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_CONTAINS_NONARRAY,
  source: 'apilint',
  message: 'contains has no effect on non arrays',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'missingField',
  linterParams: ['contains'],
  marker: 'key',
  markerTarget: 'contains',
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
        message: 'remove contains',
        action: 'removeChild',
        functionParams: ['contains'],
        target: 'parent',
      },
    ],
  },
  targetSpecs: arazzo,
};

export default containsNonArrayLint;
