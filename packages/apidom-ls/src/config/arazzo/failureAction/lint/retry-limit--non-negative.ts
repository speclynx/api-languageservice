import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const retryLimitNonNegativeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_FAILURE_ACTION_FIELD_RETRY_LIMIT_NON_NEGATIVE,
  source: 'apilint',
  message: 'retryLimit must be a non-negative integer',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintNumber',
  linterParams: [true, true, true],
  marker: 'value',
  target: 'retryLimit',
  data: {},
  targetSpecs: [...arazzo],
};

export default retryLimitNonNegativeLint;
