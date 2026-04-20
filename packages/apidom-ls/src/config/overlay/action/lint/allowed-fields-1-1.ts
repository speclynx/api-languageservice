import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay11 } from '../../target-specs.ts';

const allowedFields11Lint: LinterMeta = {
  code: ApilintCodes.NOT_ALLOWED_FIELDS,
  source: 'apilint',
  message: 'Object includes not allowed fields',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'allowedFields',
  linterParams: [['target', 'description', 'update', 'copy', 'remove'], 'x-'],
  marker: 'key',
  targetSpecs: [...Overlay11],
};

export default allowedFields11Lint;
