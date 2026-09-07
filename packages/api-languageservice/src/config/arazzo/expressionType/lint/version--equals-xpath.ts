import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const versionEqualsXpathLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_EQUALS_XPATH,
  source: 'apilint',
  message:
    "when type is 'xpath', version must be one of: 'xpath-10', 'xpath-20', 'xpath-30', 'xpath-31'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['xpath-10', 'xpath-20', 'xpath-30', 'xpath-31']],
  marker: 'value',
  target: 'version',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintContainsValue',
      params: ['xpath'],
    },
  ],
  data: {},
  targetSpecs: [...Arazzo],
};

export default versionEqualsXpathLint;
