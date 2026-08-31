import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const actionTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_ACTION_TYPE,
  source: 'apilint',
  message: 'action must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'action',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default actionTypeLint;
