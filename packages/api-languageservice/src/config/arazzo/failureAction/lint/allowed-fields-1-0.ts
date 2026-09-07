import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo10 } from '../../target-specs.ts';

// `parameters` doesn't exist on the Failure Action Object in Arazzo 1.0 - see
// allowed-fields-1-1.ts.
const allowedFields10Lint: LinterMeta = {
  code: ApilintCodes.NOT_ALLOWED_FIELDS,
  source: 'apilint',
  message: 'Object includes not allowed fields',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'allowedFields',
  linterParams: [
    ['name', 'type', 'workflowId', 'stepId', 'retryAfter', 'retryLimit', 'criteria'],
    'x-',
  ],
  marker: 'key',
  conditions: [
    {
      function: 'missingField',
      params: ['reference'],
    },
  ],
  targetSpecs: [...Arazzo10],
};

export default allowedFields10Lint;
