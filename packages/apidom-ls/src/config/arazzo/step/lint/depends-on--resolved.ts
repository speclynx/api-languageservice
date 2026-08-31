import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

// No `target` here on purpose: to resolve a plain stepId entry we need the current workflow's
// sibling steps, which is only reachable from the step element's own parent (the `steps` array),
// not from the `dependsOn` array's parent. That means the positioning logic can't use `target` +
// `marker: 'value'` either (it reads the same `meta.target` the linterFunction would receive, so
// setting it would hand the linterFunction the array instead of the step). `marker: 'key'` +
// `markerTarget` positions off `markerTarget`'s own parent independently of `target`, so it's
// used here instead - same pattern as correlation-id--only-action-receive.ts and
// correlation-id--requires-action.ts, which have the same "linterFunction needs the whole step"
// constraint.
const dependsOnResolvedLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_DEPENDS_ON_RESOLVED,
  source: 'apilint',
  message:
    '"dependsOn" entries must reference an existing stepId or a valid runtime expression.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArazzoStepDependsOnResolved',
  linterParams: [],
  marker: 'key',
  markerTarget: 'dependsOn',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default dependsOnResolvedLint;
