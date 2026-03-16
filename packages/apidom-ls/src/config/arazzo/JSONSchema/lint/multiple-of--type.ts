import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const multipleOfTypeLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_MULTIPLEOF,
  source: 'apilint',
  message: "multipleOf' value must be a number > 0",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintNumber',
  linterParams: [false, true, false],
  marker: 'value',
  target: 'multipleOf',
  data: {},
  targetSpecs: Arazzo,
};

export default multipleOfTypeLint;
