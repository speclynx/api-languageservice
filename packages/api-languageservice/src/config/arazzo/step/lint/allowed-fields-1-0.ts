import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo10 } from '../../target-specs.ts';

// `channelPath`, `timeout`, `correlationId`, `action` and `dependsOn` don't exist on the Step
// Object in Arazzo 1.0 - see allowed-fields-1-1.ts.
const allowedFields10Lint: LinterMeta = {
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
      'workflowId',
      'parameters',
      'requestBody',
      'successCriteria',
      'onSuccess',
      'onFailure',
      'outputs',
    ],
    'x-',
  ],
  marker: 'key',
  targetSpecs: [...Arazzo10],
};

export default allowedFields10Lint;
