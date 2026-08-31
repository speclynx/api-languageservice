import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

// No `target` here on purpose: the validation service skips a rule entirely when its `target`
// field is absent from the element, before conditions even run - so targeting `action` directly
// would silently never fire for a step that has `correlationId` but omits `action`. Operating on
// the whole step element and reading `action` via `apilintFieldValueOrArray` instead lets this
// rule fire when `action` is present with the wrong value; the sibling
// correlation-id--requires-action.ts rule covers the case where `action` is missing entirely.
const correlationIdOnlyActionReceiveLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_CORRELATION_ID_ONLY_ACTION_RECEIVE,
  source: 'apilint',
  message: "correlationId only applies when action is 'receive'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintFieldValueOrArray',
  linterParams: ['action', ['receive']],
  marker: 'key',
  markerTarget: 'correlationId',
  conditions: [
    {
      function: 'missingField',
      params: ['correlationId'],
      negate: true,
    },
  ],
  data: {},
  targetSpecs: [...Arazzo11],
};

export default correlationIdOnlyActionReceiveLint;
