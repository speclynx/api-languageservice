import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const titleNoScriptTagsLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_NO_SCRIPT_TAGS,
  source: 'apilint',
  message: 'Markdown title must not contain "<script>" tags.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['<[sS][cC][rR][iI][pP][tT]'],
  negate: true,
  target: 'title',
  marker: 'value',
  markerTarget: 'title',
  data: {},
  targetSpecs: [...Overlay],
};

export default titleNoScriptTagsLint;
