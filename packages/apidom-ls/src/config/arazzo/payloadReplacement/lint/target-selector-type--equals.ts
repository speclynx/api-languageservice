import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const targetSelectorTypeEqualsLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_PAYLOAD_REPLACEMENT_FIELD_TARGET_SELECTOR_TYPE_EQUALS,
  source: 'apilint',
  message:
    "targetSelectorType must be one of: 'jsonpointer', 'jsonpath', 'xpath', or an Expression Type Object",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['jsonpointer', 'jsonpath', 'xpath']],
  marker: 'value',
  target: 'targetSelectorType',
  conditions: [
    {
      targets: [{ path: 'targetSelectorType' }],
      function: 'apilintType',
      params: ['string'],
    },
  ],
  data: {},
  targetSpecs: [...Arazzo11],
};

export default targetSelectorTypeEqualsLint;
