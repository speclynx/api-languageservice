import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const actionsNonEmptyLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_ACTIONS_NON_EMPTY,
  source: 'apilint',
  message: 'actions must have at least one entry',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayNotEmpty',
  marker: 'key',
  target: 'actions',
  data: {},
  targetSpecs: [...Overlay],
};

export default actionsNonEmptyLint;
