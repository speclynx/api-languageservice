import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const stepIdResolvedLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SUCCESS_ACTION_FIELD_STEP_ID_RESOLVED,
  source: 'apilint',
  message: 'Success action "stepId" must reference an existing step in the same workflow.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArazzoActionStepIdResolved',
  linterParams: [],
  marker: 'value',
  target: 'stepId',
  data: {},
  targetSpecs: [...Arazzo],
};

export default stepIdResolvedLint;
