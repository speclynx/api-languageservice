import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

// Arazzo 1.1: output values may be a Runtime Expression string or a Selector Object.
const outputsValuesType11Lint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE,
  source: 'apilint',
  message: 'output values must be strings (Runtime Expressions) or Selector Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintChildrenOfTypeOrElementClass',
  linterParams: ['string', ['selector']],
  marker: 'value',
  target: 'outputs',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default outputsValuesType11Lint;
