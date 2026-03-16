import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const requestBodyTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_REQUEST_BODY_TYPE,
  source: 'apilint',
  message: 'requestBody must be a Request Body Object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintElementOrClass',
  linterParams: [['requestBody']],
  marker: 'value',
  target: 'requestBody',
  data: {},
  targetSpecs: [...Arazzo],
};

export default requestBodyTypeLint;
