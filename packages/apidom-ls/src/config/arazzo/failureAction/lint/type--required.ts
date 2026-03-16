import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const typeRequiredLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_FAILURE_ACTION_FIELD_TYPE_REQUIRED,
  source: 'apilint',
  message: "should always have a 'type'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['type'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'type' field",
        action: 'addChild',
        snippetYaml: 'type: end\n  ',
        snippetJson: '"type": "end",\n    ',
      },
    ],
  },
  targetSpecs: [...Arazzo],
};

export default typeRequiredLint;
