import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const operationPathMutuallyExclusiveLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_OPERATION_PATH_MUTUALLY_EXCLUSIVE,
  source: 'apilint',
  message: 'operationPath is mutually exclusive with operationId, channelPath and workflowId',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'missingFields',
  linterParams: [['operationId', 'channelPath', 'workflowId']],
  marker: 'key',
  markerTarget: 'operationPath',
  conditions: [
    {
      function: 'missingField',
      params: ['operationPath'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...Arazzo],
};

export default operationPathMutuallyExclusiveLint;
