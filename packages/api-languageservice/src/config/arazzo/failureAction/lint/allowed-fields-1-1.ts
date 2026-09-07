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
    ['name', 'type', 'workflowId', 'stepId', 'retryAfter', 'retryLimit', 'criteria', 'parameters'],
    'x-',
  ],
  marker: 'key',
  conditions: [
    {
      function: 'missingField',
      params: ['reference'],
    },
  ],
  targetSpecs: [...Arazzo11],
};

export default allowedFields11Lint;
