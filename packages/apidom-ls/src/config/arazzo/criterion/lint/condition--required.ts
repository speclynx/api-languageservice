import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const conditionRequiredLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_CRITERION_FIELD_CONDITION_REQUIRED,
  source: 'apilint',
  message: "should always have a 'condition'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['condition'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'condition' field",
        action: 'addChild',
        snippetYaml: 'condition: \n  ',
        snippetJson: '"condition": "",\n    ',
      },
    ],
  },
  targetSpecs: [...Arazzo],
};

export default conditionRequiredLint;
