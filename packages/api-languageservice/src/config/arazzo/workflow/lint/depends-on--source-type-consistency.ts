import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const dependsOnSourceTypeConsistencyLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_DEPENDS_ON_SOURCE_TYPE,
  source: 'apilint',
  message: "dependsOn entry references a sourceDescription that is not of type 'arazzo'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArazzoArraySourceDescriptionTypeConsistency',
  linterParams: [['arazzo']],
  marker: 'value',
  target: 'dependsOn',
  data: {},
  targetSpecs: [...Arazzo],
};

export default dependsOnSourceTypeConsistencyLint;
