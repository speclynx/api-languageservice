import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const minLengthTypeLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_MINLENGTH,
  source: 'apilint',
  message: 'minLength must be a non-negative integer',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintNumber',
  linterParams: [true, true, true],
  marker: 'value',
  target: 'minLength',
  data: {},
  targetSpecs: arazzo,
};

export default minLengthTypeLint;
