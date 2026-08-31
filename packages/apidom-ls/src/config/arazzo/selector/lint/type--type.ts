import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const typeTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SELECTOR_FIELD_TYPE_TYPE,
  source: 'apilint',
  message: 'type must be a string or an Expression Type Object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintElementOrClass',
  linterParams: [['expressionType']],
  marker: 'value',
  target: 'type',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintType',
      params: ['string'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...Arazzo11],
};

export default typeTypeLint;
