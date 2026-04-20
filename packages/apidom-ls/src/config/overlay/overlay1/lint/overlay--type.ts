import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const overlayTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_OVERLAY_TYPE,
  source: 'apilint',
  message: 'overlay version must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'overlay',
  data: {},
  targetSpecs: [...Overlay],
};

export default overlayTypeLint;
