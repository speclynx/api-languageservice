import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const targetTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_REUSABLE_ACTION_REFERENCE_FIELD_TARGET_TYPE,
  source: 'apilint',
  message: 'target must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'target',
  data: {},
  targetSpecs: [...Overlay12],
};

export default targetTypeLint;
