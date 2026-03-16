import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const workflowsTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SPEC_FIELD_WORKFLOWS_TYPE,
  source: 'apilint',
  message: 'workflows must be an array of Workflow Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfElementsOrClasses',
  linterParams: [['workflow']],
  marker: 'key',
  target: 'workflows',
  data: {},
  targetSpecs: [...Arazzo],
};

export default workflowsTypeLint;
