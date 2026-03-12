import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const xmlTypeLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_XML,
  source: 'apilint',
  message: 'xml must be an object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintElementOrClass',
  linterParams: [['xml']],
  marker: 'value',
  target: 'xml',
  data: {},
  targetSpecs: arazzo,
};

export default xmlTypeLint;
