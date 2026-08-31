import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

// Unlike the Workflow Object's own `workflowId`, a failureAction's `workflowId` reference MAY
// instead be a `$sourceDescriptions.` Runtime Expression when it points at an external Arazzo
// document (see workflow-id--resolved.ts) - so this pattern only applies to the plain, local-id
// form.
const workflowIdPatternLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_FAILURE_ACTION_FIELD_WORKFLOW_ID_PATTERN,
  source: 'apilint',
  message: 'workflowId SHOULD match the pattern [A-Za-z0-9_\\-]+',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[A-Za-z0-9_\\-]+$'],
  marker: 'value',
  target: 'workflowId',
  conditions: [
    {
      targets: [{ path: 'workflowId' }],
      function: 'apilintValueRegex',
      params: ['^\\$'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...Arazzo],
};

export default workflowIdPatternLint;
