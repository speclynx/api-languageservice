import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const minPropertiesNonObjectLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_MINPROPERTIES_NONOBJECT,
  source: 'apilint',
  message: 'minProperties has no effect on non objects',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'missingField',
  linterParams: ['minProperties'],
  marker: 'key',
  markerTarget: 'minProperties',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintContainsValue',
      negate: true,
      params: ['object'],
    },
  ],
  data: {
    quickFix: [
      {
        message: 'remove minProperties',
        action: 'removeChild',
        functionParams: ['minProperties'],
        target: 'parent',
      },
    ],
  },
  targetSpecs: arazzo,
};

export default minPropertiesNonObjectLint;
