import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const successActionsTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_SUCCESS_ACTIONS_TYPE,
  source: 'apilint',
  message: 'successActions must be an array of Success Action or Reusable Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfElementsOrClasses',
  linterParams: [['successAction', 'reusable']],
  marker: 'key',
  target: 'successActions',
  data: {},
  targetSpecs: [...arazzo],
};

export default successActionsTypeLint;
