import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const actionEqualsLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_ACTION_EQUALS,
  source: 'apilint',
  message: "action must be one of: 'send', 'receive'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['send', 'receive']],
  marker: 'value',
  target: 'action',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default actionEqualsLint;
