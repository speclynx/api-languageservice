import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const selfNoFragmentLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_$SELF_NO_FRAGMENT,
  source: 'apilint',
  message: '$self must not contain a fragment identifier',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[^#]*$', 'string'],
  marker: 'value',
  target: '$self',
  data: {},
  targetSpecs: [...Overlay12],
};

export default selfNoFragmentLint;
