import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const referenceTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_REUSABLE_FIELD_REFERENCE_TYPE,
  source: 'apilint',
  message: 'reference must be a string (Runtime Expression)',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'reference',
  data: {},
  targetSpecs: [...Arazzo],
};

export default referenceTypeLint;
