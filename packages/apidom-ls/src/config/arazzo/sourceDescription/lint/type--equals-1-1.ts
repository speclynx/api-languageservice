import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const typeEquals11Lint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_EQUALS,
  source: 'apilint',
  message: "type must be one of: 'openapi', 'arazzo', 'asyncapi'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['openapi', 'arazzo', 'asyncapi']],
  marker: 'value',
  target: 'type',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default typeEquals11Lint;
