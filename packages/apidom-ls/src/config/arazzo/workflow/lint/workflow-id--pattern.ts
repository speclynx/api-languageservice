import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const workflowIdPatternLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_WORKFLOW_ID_PATTERN,
  source: 'apilint',
  message: 'workflowId must match the pattern [A-Za-z0-9_\\-]+',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[A-Za-z0-9_\\-]+$'],
  marker: 'value',
  target: 'workflowId',
  data: {},
  targetSpecs: [...arazzo],
};

export default workflowIdPatternLint;
