import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

// The Arazzo 1.1 JSON Schema also allows `channel`, but the specification lists only these five
// locations for the Parameter Object, and the rule follows the specification.
const inEquals11Lint: LinterMeta = {
  code: ApilintCodes.ARAZZO_PARAMETER_FIELD_IN_EQUALS,
  source: 'apilint',
  message: "in must be one of: 'path', 'query', 'header', 'cookie', 'querystring'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['path', 'query', 'header', 'cookie', 'querystring']],
  marker: 'value',
  target: 'in',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default inEquals11Lint;
