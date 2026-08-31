import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const parametersTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_FAILURE_ACTION_FIELD_PARAMETERS_TYPE,
  source: 'apilint',
  message: 'parameters must be an array of Parameter or Reusable Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfElementsOrClasses',
  linterParams: [['parameter', 'reusable']],
  marker: 'key',
  target: 'parameters',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default parametersTypeLint;
