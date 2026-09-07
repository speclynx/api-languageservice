import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const arazzoPatternLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SPEC_FIELD_ARAZZO_PATTERN,
  source: 'apilint',
  message: 'arazzo version must match the pattern 1.0.x or 1.1.x',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^1\\.[01]\\.\\d+(-.+)?$'],
  marker: 'value',
  target: 'arazzo',
  data: {},
  targetSpecs: [...Arazzo],
};

export default arazzoPatternLint;
