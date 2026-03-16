import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const retryAfterOnlyRetryLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_FAILURE_ACTION_FIELD_RETRY_AFTER_ONLY_RETRY,
  source: 'apilint',
  message: 'retryAfter only applies when type is "retry"',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['retry']],
  marker: 'key',
  markerTarget: 'retryAfter',
  target: 'type',
  conditions: [
    {
      function: 'missingField',
      params: ['retryAfter'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...Arazzo],
};

export default retryAfterOnlyRetryLint;
