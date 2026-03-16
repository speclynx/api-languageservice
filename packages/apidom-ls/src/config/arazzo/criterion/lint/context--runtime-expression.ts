import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const contextRuntimeExpressionLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_CRITERION_FIELD_CONTEXT_RUNTIME_EXPRESSION,
  source: 'apilint',
  message: 'Criterion "context" must be a valid Arazzo Runtime Expression.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArazzoRuntimeExpression',
  linterParams: [],
  marker: 'value',
  target: 'context',
  data: {},
  targetSpecs: [...Arazzo],
};

export default contextRuntimeExpressionLint;
