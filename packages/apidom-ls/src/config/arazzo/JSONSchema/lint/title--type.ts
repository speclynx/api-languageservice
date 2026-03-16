import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const titleTypeLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_TITLE,
  source: 'apilint',
  message: "title' value must be a string",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'title',
  data: {},
  targetSpecs: Arazzo,
};

export default titleTypeLint;
