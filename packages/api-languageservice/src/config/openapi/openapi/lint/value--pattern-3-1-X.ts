import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { OpenAPI31X } from '../../target-specs.ts';

// eslint-disable-next-line @typescript-eslint/naming-convention
const valuePattern3_1_XLint: LinterMeta = {
  code: ApilintCodes.OPENAPI3_1_OPENAPI_VALUE_PATTERN_3_1_X,
  source: 'apilint',
  message: "'openapi' value must be one of 3.1.0, 3.1.1, 3.1.2",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['3\\.1\\.[012]{1}'],
  marker: 'value',
  data: {
    quickFix: [
      {
        message: "update to '3.1.0'",
        action: 'updateValue',
        functionParams: ['3.1.0'],
      },
      {
        message: "update to '3.1.1'",
        action: 'updateValue',
        functionParams: ['3.1.1'],
      },
      {
        message: "update to '3.1.2'",
        action: 'updateValue',
        functionParams: ['3.1.2'],
      },
    ],
  },
  targetSpecs: OpenAPI31X,
};

export default valuePattern3_1_XLint;
