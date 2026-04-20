import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay11 } from '../../target-specs.ts';

const overlayPattern11Lint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_OVERLAY_PATTERN,
  source: 'apilint',
  message: 'overlay version must match the pattern 1.1.x',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^1\\.1\\.\\d+$'],
  marker: 'value',
  target: 'overlay',
  data: {},
  targetSpecs: [...Overlay11],
};

export default overlayPattern11Lint;
