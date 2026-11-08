import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const parametersNoInLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_FAILURE_ACTION_FIELD_PARAMETERS_NO_IN,
  source: 'apilint',
  message: 'parameters must not use the in field',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayElementsMissingField',
  linterParams: ['parameter', 'in'],
  marker: 'key',
  target: 'parameters',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default parametersNoInLint;
