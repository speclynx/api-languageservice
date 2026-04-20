import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const extendsTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_EXTENDS_TYPE,
  source: 'apilint',
  message: 'extends must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'extends',
  data: {},
  targetSpecs: [...Overlay],
};

export default extendsTypeLint;
