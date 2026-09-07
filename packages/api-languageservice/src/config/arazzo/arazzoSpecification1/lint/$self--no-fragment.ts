import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const $selfNoFragmentLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SPEC_FIELD_$SELF_NO_FRAGMENT,
  source: 'apilint',
  message: '$self MUST NOT contain a fragment identifier',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[^#]*$'],
  marker: 'value',
  target: '$self',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default $selfNoFragmentLint;
