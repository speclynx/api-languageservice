import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const workflowIdPatternLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_WORKFLOW_ID_PATTERN,
  source: 'apilint',
  message: 'workflowId SHOULD match the pattern [A-Za-z0-9_\\-]+',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[A-Za-z0-9_\\-]+$'],
  marker: 'value',
  target: 'workflowId',
  data: {},
  targetSpecs: [...Arazzo],
};

export default workflowIdPatternLint;
