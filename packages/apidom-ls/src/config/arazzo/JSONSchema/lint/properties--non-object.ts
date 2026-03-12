import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const propertiesNonObjectLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_PROPERTIES_NONOBJECT,
  source: 'apilint',
  message: 'properties has no effect on non objects',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'missingField',
  linterParams: ['properties'],
  marker: 'key',
  markerTarget: 'properties',
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
        message: 'remove properties',
        action: 'removeChild',
        functionParams: ['properties'],
        target: 'parent',
      },
    ],
  },
  targetSpecs: arazzo,
};

export default propertiesNonObjectLint;
