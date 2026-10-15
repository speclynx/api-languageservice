import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const extendsNoFragmentLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_EXTENDS_NO_FRAGMENT,
  source: 'apilint',
  message: 'extends must not contain a fragment identifier',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[^#]*$', 'string'],
  marker: 'value',
  target: 'extends',
  data: {},
  targetSpecs: [...Overlay12],
};

export default extendsNoFragmentLint;
