import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay11 } from '../../target-specs.ts';

const updateRemoveMutuallyExclusive11Lint: LinterMeta = {
  code: ApilintCodes.OVERLAY_ACTION_FIELD_UPDATE_REMOVE_MUTUALLY_EXCLUSIVE,
  source: 'apilint',
  message: 'update is mutually exclusive with remove: true',
  severity: DiagnosticSeverity.Error,
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
  targetSpecs: [...Overlay11],
};

export default updateRemoveMutuallyExclusive11Lint;
