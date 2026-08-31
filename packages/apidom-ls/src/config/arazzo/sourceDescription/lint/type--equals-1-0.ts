import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo10 } from '../../target-specs.ts';

const typeEquals10Lint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_EQUALS,
  source: 'apilint',
  message: "type must be one of: 'openapi', 'arazzo'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['openapi', 'arazzo']],
  marker: 'value',
  target: 'type',
  data: {},
  targetSpecs: [...Arazzo10],
};

export default typeEquals10Lint;
