import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const targetNotAllowedInReusableActionLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_REUSABLE_ACTION_FIELD_FIELDS_TARGET_NOT_ALLOWED,
  source: 'apilint',
  message:
    'target must not be defined in Reusable Action fields; it is supplied by the Reusable Action Reference Object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'missingField',
  linterParams: ['target'],
  marker: 'key',
  markerTarget: 'target',
  conditions: [
    {
      targets: [{ path: 'parent' }],
      function: 'apilintElementOrClass',
      params: [['reusableAction']],
    },
  ],
  data: {},
  targetSpecs: [...Overlay12],
};

export default targetNotAllowedInReusableActionLint;
