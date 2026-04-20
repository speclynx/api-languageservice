import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay11 } from '../../target-specs.ts';

const descriptionTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_INFO_FIELD_DESCRIPTION_TYPE,
  source: 'apilint',
  message: 'description must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'description',
  data: {},
  targetSpecs: [...Overlay11],
};

export default descriptionTypeLint;
