import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const versionEqualsJsonpathLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_EQUALS_JSONPATH,
  source: 'apilint',
  message:
    "when type is 'jsonpath', version must be one of: 'rfc9535', 'draft-goessner-dispatch-jsonpath-00'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['rfc9535', 'draft-goessner-dispatch-jsonpath-00']],
  marker: 'value',
  target: 'version',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintContainsValue',
      params: ['jsonpath'],
    },
  ],
  data: {},
  targetSpecs: [...Arazzo],
};

export default versionEqualsJsonpathLint;
