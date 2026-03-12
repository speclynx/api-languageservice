import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const inTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_PARAMETER_FIELD_IN_TYPE,
  source: 'apilint',
  message: 'in must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'in',
  data: {},
  targetSpecs: [...arazzo],
};

export default inTypeLint;
