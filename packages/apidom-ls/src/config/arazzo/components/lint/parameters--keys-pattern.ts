import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const parametersKeysPatternLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_COMPONENTS_FIELD_PARAMETERS_KEYS_PATTERN,
  source: 'apilint',
  message: 'component keys must match the pattern [a-zA-Z0-9.\\-_]+',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintKeysRegex',
  linterParams: ['^[a-zA-Z0-9.\\-_]+$'],
  marker: 'key',
  target: 'parameters',
  data: {},
  targetSpecs: [...arazzo],
};

export default parametersKeysPatternLint;
