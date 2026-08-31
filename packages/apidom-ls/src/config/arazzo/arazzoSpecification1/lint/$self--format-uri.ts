import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const $selfFormatURILint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SPEC_FIELD_$SELF_FORMAT_URI,
  source: 'apilint',
  message: '$self must be in the format of a URI-reference.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValidURI',
  linterParams: [false],
  marker: 'value',
  target: '$self',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default $selfFormatURILint;
