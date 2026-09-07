import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const outputsTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_OUTPUTS_TYPE,
  source: 'apilint',
  message: 'outputs must be an object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['object'],
  marker: 'value',
  target: 'outputs',
  data: {},
  targetSpecs: [...Arazzo],
};

export default outputsTypeLint;
