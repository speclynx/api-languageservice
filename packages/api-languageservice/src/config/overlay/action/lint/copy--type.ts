import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay11 } from '../../target-specs.ts';

const copyTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_ACTION_FIELD_COPY_TYPE,
  source: 'apilint',
  message: 'copy must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'copy',
  data: {},
  targetSpecs: [...Overlay11],
};

export default copyTypeLint;
