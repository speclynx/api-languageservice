import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const targetSelectorTypeTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_PAYLOAD_REPLACEMENT_FIELD_TARGET_SELECTOR_TYPE_TYPE,
  source: 'apilint',
  message: 'targetSelectorType must be a string or an Expression Type Object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintElementOrClass',
  linterParams: [['expressionType']],
  marker: 'value',
  target: 'targetSelectorType',
  conditions: [
    {
      targets: [{ path: 'targetSelectorType' }],
      function: 'apilintType',
      params: ['string'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...Arazzo11],
};

export default targetSelectorTypeTypeLint;
