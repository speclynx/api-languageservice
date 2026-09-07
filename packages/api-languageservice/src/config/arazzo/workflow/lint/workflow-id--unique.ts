import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const workflowIdUniqueLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_WORKFLOW_ID_UNIQUE,
  source: 'apilint',
  message: "Every workflow must have a unique 'workflowId'.",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintPropertyUniqueValue',
  linterParams: [['workflow'], 'workflowId'],
  target: 'workflowId',
  marker: 'value',
  markerTarget: 'workflowId',
  data: {},
  targetSpecs: [...Arazzo],
};

export default workflowIdUniqueLint;
