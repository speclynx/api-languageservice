import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const workflowIdMutuallyExclusiveLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_FAILURE_ACTION_FIELD_WORKFLOW_ID_MUTUALLY_EXCLUSIVE,
  source: 'apilint',
  message: 'workflowId is mutually exclusive with stepId',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'missingField',
  linterParams: ['stepId'],
  marker: 'key',
  markerTarget: 'workflowId',
  conditions: [
    {
      function: 'missingField',
      params: ['workflowId'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...Arazzo],
};

export default workflowIdMutuallyExclusiveLint;
