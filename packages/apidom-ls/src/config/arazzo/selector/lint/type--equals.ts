import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const typeEqualsLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SELECTOR_FIELD_TYPE_EQUALS,
  source: 'apilint',
  message: "type must be one of: 'jsonpointer', 'jsonpath', 'xpath', or an Expression Type Object",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['jsonpointer', 'jsonpath', 'xpath']],
  marker: 'value',
  target: 'type',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintType',
      params: ['string'],
    },
  ],
  data: {},
  targetSpecs: [...Arazzo11],
};

export default typeEqualsLint;
