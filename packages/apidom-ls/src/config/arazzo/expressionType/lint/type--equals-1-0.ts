import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo10 } from '../../target-specs.ts';

// `jsonpointer` doesn't exist as an Expression Type in Arazzo 1.0 - see type--equals-1-1.ts.
const typeEquals10Lint: LinterMeta = {
  code: ApilintCodes.ARAZZO_EXPRESSION_TYPE_FIELD_TYPE_EQUALS,
  source: 'apilint',
  message: "type must be one of: 'jsonpath', 'xpath'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['jsonpath', 'xpath']],
  marker: 'value',
  target: 'type',
  data: {},
  targetSpecs: [...Arazzo10],
};

export default typeEquals10Lint;
