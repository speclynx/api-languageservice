import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const infoTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_INFO_TYPE,
  source: 'apilint',
  message: 'info must be an Info Object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintElementOrClass',
  linterParams: [['info']],
  marker: 'key',
  target: 'info',
  data: {},
  targetSpecs: [...Overlay],
};

export default infoTypeLint;
