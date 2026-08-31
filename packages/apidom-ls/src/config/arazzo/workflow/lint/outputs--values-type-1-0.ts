import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo10 } from '../../target-specs.ts';

// Arazzo 1.0.x: output values must be strings (Runtime Expressions). From Arazzo 1.1 onward,
// output values may also be a Selector Object - see outputs--values-type-1-1.ts.
const outputsValuesType10Lint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_OUTPUTS_VALUES_TYPE,
  source: 'apilint',
  message: 'output values must be strings (Runtime Expressions)',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintChildrenOfType',
  linterParams: ['string'],
  marker: 'value',
  target: 'outputs',
  data: {},
  targetSpecs: [...Arazzo10],
};

export default outputsValuesType10Lint;
