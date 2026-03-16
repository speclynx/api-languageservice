import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const successActionsValuesTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_COMPONENTS_FIELD_SUCCESS_ACTIONS_VALUES_TYPE,
  source: 'apilint',
  message: 'successActions values must be Success Action Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintChildrenOfElementsOrClasses',
  linterParams: [['successAction']],
  marker: 'key',
  target: 'successActions',
  data: {},
  targetSpecs: [...Arazzo],
};

export default successActionsValuesTypeLint;
