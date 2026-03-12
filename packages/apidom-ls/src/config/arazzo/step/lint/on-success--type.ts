import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const onSuccessTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_ON_SUCCESS_TYPE,
  source: 'apilint',
  message: 'onSuccess must be an array of Success Action or Reusable Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfElementsOrClasses',
  linterParams: [['successAction', 'reusable']],
  marker: 'key',
  target: 'onSuccess',
  data: {},
  targetSpecs: [...arazzo],
};

export default onSuccessTypeLint;
