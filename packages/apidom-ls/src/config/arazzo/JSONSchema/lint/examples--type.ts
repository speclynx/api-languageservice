import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const examplesTypeLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_EXAMPLES,
  source: 'apilint',
  message: 'examples must be an array',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArray',
  marker: 'key',
  target: 'examples',
  data: {},
  targetSpecs: Arazzo,
};

export default examplesTypeLint;
