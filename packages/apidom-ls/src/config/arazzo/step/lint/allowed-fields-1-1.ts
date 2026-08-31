import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const allowedFields11Lint: LinterMeta = {
  code: ApilintCodes.NOT_ALLOWED_FIELDS,
  source: 'apilint',
  message: 'Object includes not allowed fields',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'allowedFields',
  linterParams: [
    [
      'stepId',
      'description',
      'operationId',
      'operationPath',
      'channelPath',
      'workflowId',
      'parameters',
      'requestBody',
      'successCriteria',
      'onSuccess',
      'onFailure',
      'outputs',
      'timeout',
      'correlationId',
      'action',
      'dependsOn',
    ],
    'x-',
  ],
  marker: 'key',
  targetSpecs: [...Arazzo11],
};

export default allowedFields11Lint;
