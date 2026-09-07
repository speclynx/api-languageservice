import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const versionRequiredLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_INFO_FIELD_VERSION_REQUIRED,
  source: 'apilint',
  message: "should always have a 'version'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['version'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'version' field",
        action: 'addChild',
        snippetYaml: 'version: \n  ',
        snippetJson: '"version": "",\n    ',
      },
    ],
  },
  targetSpecs: [...Overlay],
};

export default versionRequiredLint;
