import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const operationIdSourceTypeConsistency11Lint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_OPERATION_ID_SOURCE_TYPE,
  source: 'apilint',
  message:
    "operationId references a sourceDescription that is not of type 'openapi' or 'asyncapi'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArazzoSourceDescriptionTypeConsistency',
  linterParams: [['openapi', 'asyncapi']],
  marker: 'value',
  target: 'operationId',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default operationIdSourceTypeConsistency11Lint;
