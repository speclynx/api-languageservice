import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const failureActionsTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_COMPONENTS_FIELD_FAILURE_ACTIONS_TYPE,
  source: 'apilint',
  message: 'failureActions must be an object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['object'],
  marker: 'value',
  target: 'failureActions',
  data: {},
  targetSpecs: [...Arazzo],
};

export default failureActionsTypeLint;
