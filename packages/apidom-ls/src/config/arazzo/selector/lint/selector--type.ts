import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const selectorTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SELECTOR_FIELD_SELECTOR_TYPE,
  source: 'apilint',
  message: 'selector must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'selector',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default selectorTypeLint;
