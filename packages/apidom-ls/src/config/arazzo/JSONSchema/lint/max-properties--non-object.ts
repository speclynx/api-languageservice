import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const maxPropertiesNonObjectLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_MAXPROPERTIES_NONOBJECT,
  source: 'apilint',
  message: 'maxProperties has no effect on non objects',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'missingField',
  linterParams: ['maxProperties'],
  marker: 'key',
  markerTarget: 'maxProperties',
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
        message: 'remove maxProperties',
        action: 'removeChild',
        functionParams: ['maxProperties'],
        target: 'parent',
      },
    ],
  },
  targetSpecs: arazzo,
};

export default maxPropertiesNonObjectLint;
