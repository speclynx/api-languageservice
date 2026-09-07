import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const outputsNamesUniqueLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_OUTPUTS_NAMES_UNIQUE,
  source: 'apilint',
  message: 'Step output names must be unique.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintNoDuplicateKeys',
  target: 'outputs',
  marker: 'value',
  markerTarget: 'outputs',
  data: {},
  targetSpecs: [...Arazzo],
};

export default outputsNamesUniqueLint;
