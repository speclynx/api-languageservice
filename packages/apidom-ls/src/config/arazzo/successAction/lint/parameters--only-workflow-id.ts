import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const parametersOnlyWorkflowIdLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SUCCESS_ACTION_FIELD_PARAMETERS_ONLY_WORKFLOW_ID,
  source: 'apilint',
  message: 'parameters only applies when workflowId is set',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'hasRequiredField',
  linterParams: ['workflowId'],
  marker: 'key',
  markerTarget: 'parameters',
  conditions: [
    {
      function: 'missingField',
      params: ['parameters'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...Arazzo11],
};

export default parametersOnlyWorkflowIdLint;
