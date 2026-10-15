import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const refTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_REUSABLE_ACTION_REFERENCE_FIELD_$REF_TYPE,
  source: 'apilint',
  message: '$ref must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: '$ref',
  data: {},
  targetSpecs: [...Overlay12],
};

export default refTypeLint;
