import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo10 } from '../../target-specs.ts';

// Arazzo 1.0 only: `version` was always required there. From 1.1 onward the spec's own
// description says "If the `version` is omitted, a default value is assumed based on the
// expression `type`" - i.e. version is genuinely optional for every type, not just jsonpointer.
// (The vendored 1.1 JSON schema still lists `version` as required despite that same description
// text - an upstream inconsistency this rule deliberately does not carry forward.)
const versionRequired10Lint: LinterMeta = {
  code: ApilintCodes.ARAZZO_EXPRESSION_TYPE_FIELD_VERSION_REQUIRED,
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
  targetSpecs: [...Arazzo10],
};

export default versionRequired10Lint;
