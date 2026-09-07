import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const dependsOnTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_WORKFLOW_FIELD_DEPENDS_ON_TYPE,
  source: 'apilint',
  message: 'dependsOn must be an array of strings',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfType',
  linterParams: ['string'],
  marker: 'key',
  target: 'dependsOn',
  data: {},
  targetSpecs: [...Arazzo],
};

export default dependsOnTypeLint;
