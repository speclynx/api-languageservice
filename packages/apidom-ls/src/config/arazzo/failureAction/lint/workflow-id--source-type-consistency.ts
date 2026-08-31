import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const workflowIdSourceTypeConsistencyLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_FAILURE_ACTION_FIELD_WORKFLOW_ID_SOURCE_TYPE,
  source: 'apilint',
  message: "workflowId references a sourceDescription that is not of type 'arazzo'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArazzoSourceDescriptionTypeConsistency',
  linterParams: [['arazzo']],
  marker: 'value',
  target: 'workflowId',
  data: {},
  targetSpecs: [...Arazzo],
};

export default workflowIdSourceTypeConsistencyLint;
