import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const workflowIdMutuallyExclusiveLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_WORKFLOW_ID_MUTUALLY_EXCLUSIVE,
  source: 'apilint',
  message: 'workflowId is mutually exclusive with operationId, operationPath and channelPath',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'missingFields',
  linterParams: [['operationId', 'operationPath', 'channelPath']],
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
