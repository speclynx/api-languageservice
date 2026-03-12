import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const urlTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SOURCE_DESCRIPTION_FIELD_URL_TYPE,
  source: 'apilint',
  message: 'url must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'url',
  data: {},
  targetSpecs: [...arazzo],
};

export default urlTypeLint;
