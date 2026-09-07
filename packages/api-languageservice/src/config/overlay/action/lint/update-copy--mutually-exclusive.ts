import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay11 } from '../../target-specs.ts';

const updateCopyMutuallyExclusiveLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_ACTION_FIELD_UPDATE_COPY_MUTUALLY_EXCLUSIVE,
  source: 'apilint',
  message: 'update is mutually exclusive with copy',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'missingField',
  linterParams: ['copy'],
  marker: 'key',
  markerTarget: 'update',
  conditions: [
    {
      function: 'missingField',
      params: ['update'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...Overlay11],
};

export default updateCopyMutuallyExclusiveLint;
