import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const actionsTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_COMPONENTS_FIELD_ACTIONS_TYPE,
  source: 'apilint',
  message: 'actions must be an object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['object'],
  marker: 'key',
  target: 'actions',
  data: {},
  targetSpecs: [...Overlay12],
};

export default actionsTypeLint;
