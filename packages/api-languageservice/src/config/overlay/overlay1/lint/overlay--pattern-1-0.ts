import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay10 } from '../../target-specs.ts';

const overlayPattern10Lint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_OVERLAY_PATTERN,
  source: 'apilint',
  message: 'overlay version must match the pattern 1.0.x',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^1\\.0\\.\\d+$'],
  marker: 'value',
  target: 'overlay',
  data: {},
  targetSpecs: [...Overlay10],
};

export default overlayPattern10Lint;
