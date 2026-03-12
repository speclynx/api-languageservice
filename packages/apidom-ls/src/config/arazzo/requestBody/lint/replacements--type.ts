import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const replacementsTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_REQUEST_BODY_FIELD_REPLACEMENTS_TYPE,
  source: 'apilint',
  message: 'replacements must be an array of Payload Replacement Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfElementsOrClasses',
  linterParams: [['payloadReplacement']],
  marker: 'key',
  target: 'replacements',
  data: {},
  targetSpecs: [...arazzo],
};

export default replacementsTypeLint;
