import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay10 } from '../../target-specs.ts';

const updateRemoveMutuallyExclusive10Lint: LinterMeta = {
  code: ApilintCodes.OVERLAY_ACTION_FIELD_UPDATE_REMOVE_MUTUALLY_EXCLUSIVE,
  source: 'apilint',
  message: 'update has no effect when remove is true',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'missingField',
  linterParams: ['update'],
  marker: 'key',
  markerTarget: 'update',
  conditions: [
    {
      targets: [{ path: 'remove' }],
      function: 'apilintContainsValue',
      params: [true],
    },
  ],
  data: {},
  targetSpecs: [...Overlay10],
};

export default updateRemoveMutuallyExclusive10Lint;
