import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const inEqualsLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_PARAMETER_FIELD_IN_EQUALS,
  source: 'apilint',
  message: "in must be one of: 'path', 'query', 'header', 'cookie', 'body'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['path', 'query', 'header', 'cookie', 'body']],
  marker: 'value',
  target: 'in',
  data: {},
  targetSpecs: [...arazzo],
};

export default inEqualsLint;
