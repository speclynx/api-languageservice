import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const refFormatLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_REUSABLE_ACTION_REFERENCE_FIELD_$REF_FORMAT,
  source: 'apilint',
  message: "$ref must be a same-document reference in the form '#/components/actions/{name}'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^#/components/actions/(?:[^~/]|~0|~1)+$', 'string'],
  marker: 'value',
  target: '$ref',
  data: {},
  targetSpecs: [...Overlay12],
};

export default refFormatLint;
