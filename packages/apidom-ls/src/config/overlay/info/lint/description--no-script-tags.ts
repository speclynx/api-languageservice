import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay11 } from '../../target-specs.ts';

const descriptionNoScriptTagsLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_NO_SCRIPT_TAGS,
  source: 'apilint',
  message: 'Markdown description must not contain "<script>" tags.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['<[sS][cC][rR][iI][pP][tT]'],
  negate: true,
  target: 'description',
  marker: 'value',
  markerTarget: 'description',
  data: {},
  targetSpecs: [...Overlay11],
};

export default descriptionNoScriptTagsLint;
