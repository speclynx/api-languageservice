import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const elseNonIfLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_ELSE_NONIF,
  source: 'apilint',
  message: '"else" has no effect without a "if"',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'missingField',
  linterParams: ['else'],
  marker: 'key',
  markerTarget: 'else',
  conditions: [
    {
      function: 'missingField',
      params: ['if'],
    },
  ],
  data: {
    quickFix: [
      {
        message: 'remove else',
        action: 'removeChild',
        functionParams: ['else'],
        target: 'parent',
      },
    ],
  },
  targetSpecs: arazzo,
};

export default elseNonIfLint;
