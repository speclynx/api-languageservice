import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const inputsValuesTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_COMPONENTS_FIELD_INPUTS_VALUES_TYPE,
  source: 'apilint',
  message: 'inputs values must be JSON Schema Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintChildrenOfElementsOrClasses',
  linterParams: [['JSONSchema']],
  marker: 'key',
  target: 'inputs',
  data: {},
  targetSpecs: [...arazzo],
};

export default inputsValuesTypeLint;
