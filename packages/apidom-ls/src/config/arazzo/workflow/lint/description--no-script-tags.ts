import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const descriptionNoScriptTagsLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SPEC_NO_SCRIPT_TAGS,
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
  targetSpecs: [...Arazzo],
};

export default descriptionNoScriptTagsLint;
