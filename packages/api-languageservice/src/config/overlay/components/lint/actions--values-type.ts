import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const actionsValuesTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_COMPONENTS_FIELD_ACTIONS_VALUES_TYPE,
  source: 'apilint',
  message: 'actions must be an object containing Reusable Action Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintChildrenOfElementsOrClasses',
  linterParams: [['reusableAction']],
  marker: 'key',
  target: 'actions',
  conditions: [
    {
      targets: [{ path: 'actions' }],
      function: 'apilintType',
      params: ['object'],
    },
  ],
  data: {},
  targetSpecs: [...Overlay12],
};

export default actionsValuesTypeLint;
