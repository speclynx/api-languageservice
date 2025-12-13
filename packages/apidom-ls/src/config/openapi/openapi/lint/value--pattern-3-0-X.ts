import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { OpenAPI30X } from '../../target-specs.ts';

// eslint-disable-next-line @typescript-eslint/naming-convention
const valuePattern3_0_XLint: LinterMeta = {
  code: ApilintCodes.OPENAPI3_0_OPENAPI_VALUE_PATTERN_3_0_X,
  source: 'apilint',
  message: "'openapi' value must be one of 3.0.0, 3.0.1, 3.0.2, 3.0.3, 3.0.4",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['3\\.0\\.[01234]{1}'],
  marker: 'value',
  data: {
    quickFix: [
      {
        message: "update to '3.0.0'",
        action: 'updateValue',
        functionParams: ['3.0.0'],
      },
      {
        message: "update to '3.0.1'",
        action: 'updateValue',
        functionParams: ['3.0.1'],
      },
      {
        message: "update to '3.0.2'",
        action: 'updateValue',
        functionParams: ['3.0.2'],
      },
      {
        message: "update to '3.0.3'",
        action: 'updateValue',
        functionParams: ['3.0.3'],
      },
      {
        message: "update to '3.0.4'",
        action: 'updateValue',
        functionParams: ['3.0.4'],
      },
    ],
  },
  targetSpecs: OpenAPI30X,
};

export default valuePattern3_0_XLint;
