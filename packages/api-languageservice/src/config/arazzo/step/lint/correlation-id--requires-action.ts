import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

// Covers the case correlation-id--only-action-receive.ts cannot: `correlationId` present but
// `action` omitted entirely.
const correlationIdRequiresActionLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_CORRELATION_ID_REQUIRES_ACTION,
  source: 'apilint',
  message: "correlationId requires action to be present and set to 'receive'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['action'],
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

export default correlationIdRequiresActionLint;
