import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const actionsTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_ACTIONS_TYPE,
  source: 'apilint',
  message: 'actions must be an array of Action Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfElementsOrClasses',
  linterParams: [['action']],
  marker: 'key',
  target: 'actions',
  data: {},
  targetSpecs: [...Overlay],
};

export default actionsTypeLint;
