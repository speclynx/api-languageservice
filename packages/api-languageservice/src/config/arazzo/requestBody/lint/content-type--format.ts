import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const contentTypeFormatLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_FORMAT,
  source: 'apilint',
  message: 'Request body "contentType" should be a valid MIME type (e.g. "application/json").',
  severity: DiagnosticSeverity.Warning,
  linterFunction: 'apilintArazzoContentTypeFormat',
  linterParams: [],
  marker: 'value',
  target: 'contentType',
  data: {},
  targetSpecs: [...Arazzo],
};

export default contentTypeFormatLint;
