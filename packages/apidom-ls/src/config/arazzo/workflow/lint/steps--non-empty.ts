import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const stepsNonEmptyLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_STEPS_NON_EMPTY,
  source: 'apilint',
  message: 'steps must have at least one entry',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayNotEmpty',
  marker: 'key',
  target: 'steps',
  data: {},
  targetSpecs: [...arazzo],
};

export default stepsNonEmptyLint;
