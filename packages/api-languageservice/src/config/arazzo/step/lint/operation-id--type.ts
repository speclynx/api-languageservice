import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const operationIdTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_OPERATION_ID_TYPE,
  source: 'apilint',
  message: 'operationId must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'operationId',
  data: {},
  targetSpecs: [...Arazzo],
};

export default operationIdTypeLint;
