import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const valueTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_REUSABLE_FIELD_VALUE_TYPE,
  source: 'apilint',
  message: 'value must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'value',
  data: {},
  targetSpecs: [...Arazzo],
};

export default valueTypeLint;
