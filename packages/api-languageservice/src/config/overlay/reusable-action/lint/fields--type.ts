import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const fieldsTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_REUSABLE_ACTION_FIELD_FIELDS_TYPE,
  source: 'apilint',
  message: 'fields must be an Action Object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintElementOrClass',
  linterParams: [['action']],
  marker: 'key',
  target: 'fields',
  data: {},
  conditions: [
    {
      function: 'missingField',
      params: ['$ref'],
    },
  ],
  targetSpecs: [...Overlay12],
};

export default fieldsTypeLint;
