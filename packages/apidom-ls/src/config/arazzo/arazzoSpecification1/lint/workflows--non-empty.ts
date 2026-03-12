import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const workflowsNonEmptyLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SPEC_FIELD_WORKFLOWS_NON_EMPTY,
  source: 'apilint',
  message: 'workflows must have at least one entry',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayNotEmpty',
  marker: 'key',
  target: 'workflows',
  data: {},
  targetSpecs: [...arazzo],
};

export default workflowsNonEmptyLint;
