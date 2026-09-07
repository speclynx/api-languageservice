import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const targetTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_ACTION_FIELD_TARGET_TYPE,
  source: 'apilint',
  message: 'target must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'target',
  data: {},
  targetSpecs: [...Overlay],
};

export default targetTypeLint;
