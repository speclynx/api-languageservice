import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const uniqueItemsTypeLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_UNIQUEITEMS,
  source: 'apilint',
  message: 'uniqueItems must be a boolean',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['boolean'],
  marker: 'value',
  target: 'uniqueItems',
  data: {},
  targetSpecs: arazzo,
};

export default uniqueItemsTypeLint;
