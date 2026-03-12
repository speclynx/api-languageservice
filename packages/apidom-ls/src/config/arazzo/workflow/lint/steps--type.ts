import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const stepsTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_STEPS_TYPE,
  source: 'apilint',
  message: 'steps must be an array of Step Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfElementsOrClasses',
  linterParams: [['step']],
  marker: 'key',
  target: 'steps',
  data: {},
  targetSpecs: [...arazzo],
};

export default stepsTypeLint;
