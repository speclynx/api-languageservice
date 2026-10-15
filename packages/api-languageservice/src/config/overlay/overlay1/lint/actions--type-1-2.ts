import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const actionsType12Lint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_ACTIONS_TYPE,
  source: 'apilint',
  message: 'actions must be an array of Action Objects or Reusable Action Reference Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfElementsOrClasses',
  linterParams: [['action', 'reusableActionReference']],
  marker: 'key',
  target: 'actions',
  data: {},
  targetSpecs: [...Overlay12],
};

export default actionsType12Lint;
