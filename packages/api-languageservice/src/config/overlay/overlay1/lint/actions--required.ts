import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const actionsRequiredLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_ACTIONS_REQUIRED,
  source: 'apilint',
  message: "should always have an 'actions' list",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['actions'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'actions' field",
        action: 'addChild',
        snippetYaml: 'actions: \n  - target: \n  ',
        snippetJson: '"actions": [],\n    ',
      },
    ],
  },
  targetSpecs: [...Overlay],
};

export default actionsRequiredLint;
