import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const dependsOnResolvedLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_DEPENDS_ON_RESOLVED,
  source: 'apilint',
  message: '"dependsOn" entries must reference existing workflow IDs.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArazzoArrayValuesResolveToWorkflows',
  linterParams: [],
  marker: 'value',
  target: 'dependsOn',
  data: {},
  targetSpecs: [...Arazzo],
};

export default dependsOnResolvedLint;
