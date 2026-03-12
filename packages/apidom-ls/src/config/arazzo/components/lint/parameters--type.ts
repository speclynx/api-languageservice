import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const parametersTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_COMPONENTS_FIELD_PARAMETERS_TYPE,
  source: 'apilint',
  message: 'parameters must be an object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['object'],
  marker: 'value',
  target: 'parameters',
  data: {},
  targetSpecs: [...arazzo],
};

export default parametersTypeLint;
