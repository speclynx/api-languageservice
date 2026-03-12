import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const inputsTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_INPUTS_TYPE,
  source: 'apilint',
  message: 'inputs must be a JSON Schema object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintElementOrClass',
  linterParams: [['JSONSchema']],
  marker: 'value',
  target: 'inputs',
  data: {},
  targetSpecs: [...arazzo],
};

export default inputsTypeLint;
