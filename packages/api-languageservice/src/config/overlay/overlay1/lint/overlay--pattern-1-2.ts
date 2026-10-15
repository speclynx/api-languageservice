import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const overlayPattern12Lint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_OVERLAY_PATTERN,
  source: 'apilint',
  message: 'overlay version must match the pattern 1.2.x',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^1\\.2\\.\\d+$'],
  marker: 'value',
  target: 'overlay',
  data: {},
  targetSpecs: [...Overlay12],
};

export default overlayPattern12Lint;
