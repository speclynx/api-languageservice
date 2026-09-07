import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const successCriteriaTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_SUCCESS_CRITERIA_TYPE,
  source: 'apilint',
  message: 'successCriteria must be an array of Criterion Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfElementsOrClasses',
  linterParams: [['criterion']],
  marker: 'key',
  target: 'successCriteria',
  data: {},
  targetSpecs: [...Arazzo],
};

export default successCriteriaTypeLint;
