import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const descriptionTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_REUSABLE_ACTION_FIELD_DESCRIPTION_TYPE,
  source: 'apilint',
  message: 'description must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'description',
  data: {},
  conditions: [
    {
      function: 'apilintElementOrClass',
      params: [['reusableActionReference']],
      negate: true,
    },
  ],
  targetSpecs: [...Overlay12],
};

export default descriptionTypeLint;
