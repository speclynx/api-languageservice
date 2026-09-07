import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const summaryRecommendedLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_INFO_FIELD_SUMMARY_RECOMMENDED,
  source: 'apilint',
  message: "Info 'summary' is recommended to be present and a non-empty string.",
  severity: DiagnosticSeverity.Hint,
  linterFunction: 'hasRequiredField',
  linterParams: ['summary'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'summary' field",
        action: 'addChild',
        snippetYaml: 'summary: \n  ',
        snippetJson: '"summary": "",\n    ',
      },
    ],
  },
  targetSpecs: [...Arazzo],
};

export default summaryRecommendedLint;
