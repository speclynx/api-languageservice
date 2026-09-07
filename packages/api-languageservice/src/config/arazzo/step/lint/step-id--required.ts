import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const stepIdRequiredLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_STEP_ID_REQUIRED,
  source: 'apilint',
  message: "should always have a 'stepId'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['stepId'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'stepId' field",
        action: 'addChild',
        snippetYaml: 'stepId: \n  ',
        snippetJson: '"stepId": "",\n    ',
      },
    ],
  },
  targetSpecs: [...Arazzo],
};

export default stepIdRequiredLint;
