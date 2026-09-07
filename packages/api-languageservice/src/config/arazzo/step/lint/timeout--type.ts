import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const timeoutTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_TIMEOUT_TYPE,
  source: 'apilint',
  message: 'timeout must be an integer',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintNumber',
  linterParams: [true],
  marker: 'value',
  target: 'timeout',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default timeoutTypeLint;
