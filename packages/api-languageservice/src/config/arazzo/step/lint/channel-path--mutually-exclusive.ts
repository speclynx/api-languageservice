import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const channelPathMutuallyExclusiveLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_CHANNEL_PATH_MUTUALLY_EXCLUSIVE,
  source: 'apilint',
  message: 'channelPath is mutually exclusive with operationId, operationPath and workflowId',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'missingFields',
  linterParams: [['operationId', 'operationPath', 'workflowId']],
  marker: 'key',
  markerTarget: 'channelPath',
  conditions: [
    {
      function: 'missingField',
      params: ['channelPath'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...Arazzo11],
};

export default channelPathMutuallyExclusiveLint;
