import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const minLengthNonStringLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_MINLENGTH_NONSTRING,
  source: 'apilint',
  message: 'minLength has no effect on non strings',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'missingField',
  linterParams: ['minLength'],
  marker: 'key',
  markerTarget: 'minLength',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintContainsValue',
      negate: true,
      params: ['string'],
    },
  ],
  data: {
    quickFix: [
      {
        message: 'remove minLength',
        action: 'removeChild',
        functionParams: ['minLength'],
        target: 'parent',
      },
    ],
  },
  targetSpecs: Arazzo,
};

export default minLengthNonStringLint;
