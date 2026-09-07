import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const extendsFormatURILint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_EXTENDS_FORMAT_URI,
  source: 'apilint',
  message: 'extends must be in the format of a URI-reference.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValidURI',
  linterParams: [false],
  marker: 'value',
  target: 'extends',
  data: {},
  targetSpecs: [...Overlay],
};

export default extendsFormatURILint;
