import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const arazzoRequiredLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SPEC_FIELD_ARAZZO_REQUIRED,
  source: 'apilint',
  message: "should always have an 'arazzo' version field",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['arazzo'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'arazzo' field",
        action: 'addChild',
        snippetYaml: 'arazzo: 1.0.1\n  ',
        snippetJson: '"arazzo": "1.0.1",\n    ',
      },
    ],
  },
  targetSpecs: [...arazzo],
};

export default arazzoRequiredLint;
