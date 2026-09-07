import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const dependsOnUniqueLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_DEPENDS_ON_UNIQUE,
  source: 'apilint',
  message: "'dependsOn' entries must be unique.",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayUniqueValues',
  target: 'dependsOn',
  marker: 'value',
  markerTarget: 'dependsOn',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default dependsOnUniqueLint;
