import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay11 } from '../../target-specs.ts';

const copyJSONPathValidLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_ACTION_FIELD_COPY_JSONPATH_VALID,
  source: 'apilint',
  message: 'copy must be a valid RFC 9535 JSONPath expression',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintJSONPathRFC9535',
  marker: 'value',
  target: 'copy',
  data: {},
  targetSpecs: [...Overlay11],
};

export default copyJSONPathValidLint;
