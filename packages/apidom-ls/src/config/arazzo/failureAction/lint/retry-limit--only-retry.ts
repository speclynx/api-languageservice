import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const retryLimitOnlyRetryLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_FAILURE_ACTION_FIELD_RETRY_LIMIT_ONLY_RETRY,
  source: 'apilint',
  message: 'retryLimit only applies when type is "retry"',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['retry']],
  marker: 'key',
  markerTarget: 'retryLimit',
  target: 'type',
  conditions: [
    {
      function: 'missingField',
      params: ['retryLimit'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...arazzo],
};

export default retryLimitOnlyRetryLint;
