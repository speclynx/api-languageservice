import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo10 } from '../../target-specs.ts';

// `asyncapi` isn't a valid sourceDescription.type until Arazzo 1.1 (see
// sourceDescription/lint/type--equals-1-0.ts) - see -1-1.ts for that case.
const operationIdSourceTypeConsistency10Lint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_OPERATION_ID_SOURCE_TYPE,
  source: 'apilint',
  message: "operationId references a sourceDescription that is not of type 'openapi'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArazzoSourceDescriptionTypeConsistency',
  linterParams: [['openapi']],
  marker: 'value',
  target: 'operationId',
  data: {},
  targetSpecs: [...Arazzo10],
};

export default operationIdSourceTypeConsistency10Lint;
