import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay11 } from '../../target-specs.ts';

const copyRemoveMutuallyExclusiveLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_ACTION_FIELD_COPY_REMOVE_MUTUALLY_EXCLUSIVE,
  source: 'apilint',
  message: 'copy is mutually exclusive with remove: true',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'missingField',
  linterParams: ['copy'],
  marker: 'key',
  markerTarget: 'copy',
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

export default copyRemoveMutuallyExclusiveLint;
