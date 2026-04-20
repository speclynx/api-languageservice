import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const infoRequiredLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_INFO_REQUIRED,
  source: 'apilint',
  message: "should always have an 'info' object",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['info'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'info' field",
        action: 'addChild',
        snippetYaml: 'info: \n  title: \n  version: \n  ',
        snippetJson: '"info": {},\n    ',
      },
    ],
  },
  targetSpecs: [...Overlay],
};

export default infoRequiredLint;
