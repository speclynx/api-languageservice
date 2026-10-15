import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

// Reusable Action References carry `referenced-element: reusableAction`, so rules of the
// referenced type also run on them. Skip actual references only: a definition in
// `components.actions` with an illegal `$ref` is still a Reusable Action and must be linted.
const allowedFieldsLint: LinterMeta = {
  code: ApilintCodes.NOT_ALLOWED_FIELDS,
  source: 'apilint',
  message: 'Object includes not allowed fields',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'allowedFields',
  linterParams: [['description', 'fields'], 'x-'],
  marker: 'key',
  conditions: [
    {
      function: 'apilintElementOrClass',
      params: [['reusableActionReference']],
      negate: true,
    },
  ],
  targetSpecs: [...Overlay12],
};

export default allowedFieldsLint;
