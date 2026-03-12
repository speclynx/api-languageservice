import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const additionalPropertiesNonObjectLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_ADDITIONALPROPERTIES_NONOBJECT,
  source: 'apilint',
  message: 'additionalProperties has no effect on non objects',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'missingField',
  linterParams: ['additionalProperties'],
  marker: 'key',
  markerTarget: 'additionalProperties',
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
        message: 'remove additionalProperties',
        action: 'removeChild',
        functionParams: ['additionalProperties'],
        target: 'parent',
      },
    ],
  },
  targetSpecs: arazzo,
};

export default additionalPropertiesNonObjectLint;
