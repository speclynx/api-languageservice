import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const nameUniqueLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_FAILURE_ACTIONS_NAMES_UNIQUE,
  source: 'apilint',
  message: "Every failure action must have a unique 'name'.",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintSiblingUniqueValue',
  linterParams: ['name'],
  marker: 'value',
  markerTarget: 'name',
  data: {},
  targetSpecs: [...Arazzo],
};

export default nameUniqueLint;
