import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const referenceRequiredLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_REUSABLE_FIELD_REFERENCE_REQUIRED,
  source: 'apilint',
  message: "should always have a 'reference'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['reference'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'reference' field",
        action: 'addChild',
        snippetYaml: 'reference: \n  ',
        snippetJson: '"reference": "",\n    ',
      },
    ],
  },
  targetSpecs: [...arazzo],
};

export default referenceRequiredLint;
