import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const overlayRequiredLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_OVERLAY_REQUIRED,
  source: 'apilint',
  message: "should always have an 'overlay' version field",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['overlay'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'overlay' field",
        action: 'addChild',
        snippetYaml: 'overlay: 1.1.0\n  ',
        snippetJson: '"overlay": "1.1.0",\n    ',
      },
    ],
  },
  targetSpecs: [...Overlay],
};

export default overlayRequiredLint;
