import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const summaryNoScriptTagsLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SPEC_NO_SCRIPT_TAGS,
  source: 'apilint',
  message: 'Markdown summary must not contain "<script>" tags.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['<[sS][cC][rR][iI][pP][tT]'],
  negate: true,
  target: 'summary',
  marker: 'value',
  markerTarget: 'summary',
  data: {},
  targetSpecs: [...Arazzo],
};

export default summaryNoScriptTagsLint;
