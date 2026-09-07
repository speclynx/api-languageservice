import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const contextTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SELECTOR_FIELD_CONTEXT_TYPE,
  source: 'apilint',
  message: 'context must be a string (Runtime Expression)',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'context',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default contextTypeLint;
