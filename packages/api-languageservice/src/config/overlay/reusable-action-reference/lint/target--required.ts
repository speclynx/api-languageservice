import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const targetRequiredLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_REUSABLE_ACTION_REFERENCE_FIELD_TARGET_REQUIRED,
  source: 'apilint',
  message: "should always have a 'target'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['target'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'target' field",
        action: 'addChild',
        snippetYaml: 'target: \n  ',
        snippetJson: '"target": "",\n    ',
      },
    ],
  },
  targetSpecs: [...Overlay12],
};

export default targetRequiredLint;
