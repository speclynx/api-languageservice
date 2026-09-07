import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const removeTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_ACTION_FIELD_REMOVE_TYPE,
  source: 'apilint',
  message: 'remove must be a boolean',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['boolean'],
  marker: 'value',
  target: 'remove',
  data: {},
  targetSpecs: [...Overlay],
};

export default removeTypeLint;
