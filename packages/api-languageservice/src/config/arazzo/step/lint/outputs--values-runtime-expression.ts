import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const outputsValuesRuntimeExpressionLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_OUTPUTS_VALUES_RUNTIME_EXPRESSION,
  source: 'apilint',
  message: 'Step output values must be valid Arazzo Runtime Expressions.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintObjectValuesArazzoRuntimeExpression',
  linterParams: [],
  marker: 'value',
  target: 'outputs',
  data: {},
  targetSpecs: [...Arazzo],
};

export default outputsValuesRuntimeExpressionLint;
