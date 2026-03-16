import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const $idFormatURILint: LinterMeta = {
  code: ApilintCodes.SCHEMA_ID,
  source: 'apilint',
  message: "'$id' value must be a valid URI-reference string",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValidURI',
  marker: 'value',
  target: '$id',
  data: {},
  targetSpecs: Arazzo,
};

export default $idFormatURILint;
