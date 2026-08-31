import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const stepIdPatternLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_STEP_ID_PATTERN,
  source: 'apilint',
  message: 'stepId SHOULD match the pattern [A-Za-z0-9_\\-]+',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[A-Za-z0-9_\\-]+$'],
  marker: 'value',
  target: 'stepId',
  data: {},
  targetSpecs: [...Arazzo],
};

export default stepIdPatternLint;
