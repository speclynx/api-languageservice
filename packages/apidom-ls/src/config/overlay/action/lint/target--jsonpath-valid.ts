import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay } from '../../target-specs.ts';

const targetJSONPathValidLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_ACTION_FIELD_TARGET_JSONPATH_VALID,
  source: 'apilint',
  message: 'target must be a valid RFC 9535 JSONPath expression',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintJSONPathRFC9535',
  marker: 'value',
  target: 'target',
  data: {},
  targetSpecs: [...Overlay],
};

export default targetJSONPathValidLint;
