import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const operationIdMutuallyExclusiveLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_OPERATION_ID_MUTUALLY_EXCLUSIVE,
  source: 'apilint',
  message: 'operationId is mutually exclusive with operationPath, channelPath and workflowId',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'missingFields',
  linterParams: [['operationPath', 'channelPath', 'workflowId']],
  marker: 'key',
  markerTarget: 'operationId',
  conditions: [
    {
      function: 'missingField',
      params: ['operationId'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...Arazzo],
};

export default operationIdMutuallyExclusiveLint;
