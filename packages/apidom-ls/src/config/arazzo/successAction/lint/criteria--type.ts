import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const criteriaTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SUCCESS_ACTION_FIELD_CRITERIA_TYPE,
  source: 'apilint',
  message: 'criteria must be an array of Criterion Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfElementsOrClasses',
  linterParams: [['criterion']],
  marker: 'key',
  target: 'criteria',
  data: {},
  targetSpecs: [...arazzo],
};

export default criteriaTypeLint;
