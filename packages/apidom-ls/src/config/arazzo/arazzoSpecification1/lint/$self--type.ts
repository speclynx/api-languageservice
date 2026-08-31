import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const $selfTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SPEC_FIELD_$SELF_TYPE,
  source: 'apilint',
  message: '$self must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: '$self',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default $selfTypeLint;
