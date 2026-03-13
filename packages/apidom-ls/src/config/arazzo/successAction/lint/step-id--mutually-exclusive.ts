import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const stepIdMutuallyExclusiveLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SUCCESS_ACTION_FIELD_STEP_ID_MUTUALLY_EXCLUSIVE,
  source: 'apilint',
  message: 'stepId is mutually exclusive with workflowId',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'missingField',
  linterParams: ['workflowId'],
  marker: 'key',
  markerTarget: 'stepId',
  conditions: [
    {
      function: 'missingField',
      params: ['stepId'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...arazzo],
};

export default stepIdMutuallyExclusiveLint;
