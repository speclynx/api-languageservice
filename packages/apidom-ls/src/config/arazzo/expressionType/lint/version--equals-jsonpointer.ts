import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const versionEqualsJsonpointerLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_EQUALS_JSONPOINTER,
  source: 'apilint',
  message: "when type is 'jsonpointer', version must be 'rfc6901'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['rfc6901']],
  marker: 'value',
  target: 'version',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintContainsValue',
      params: ['jsonpointer'],
    },
  ],
  data: {},
  targetSpecs: [...Arazzo],
};

export default versionEqualsJsonpointerLint;
