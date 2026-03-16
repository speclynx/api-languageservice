import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const requiredDefinedLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_REQUIRED_WITHOUT_PROPERTIES,
  source: 'apilint',
  message:
    'required properties should be defined in `properties` when `additionalProperties` is false',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'apilintRequiredDefinedInProperties',
  marker: 'key',
  target: 'required',
  markerTarget: 'required',
  conditions: [
    {
      targets: [{ path: 'additionalProperties' }],
      function: 'apilintContainsValue',
      params: [false],
    },
  ],
  data: {},
  targetSpecs: Arazzo,
};

export default requiredDefinedLint;
