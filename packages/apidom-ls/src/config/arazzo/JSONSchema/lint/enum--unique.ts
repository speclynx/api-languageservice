import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const enumUniqueLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_ENUM,
  source: 'apilint',
  message: "enum' value must be an array with unique values",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintUniqueArray',
  marker: 'value',
  target: 'enum',
  data: {},
  targetSpecs: arazzo,
};

export default enumUniqueLint;
