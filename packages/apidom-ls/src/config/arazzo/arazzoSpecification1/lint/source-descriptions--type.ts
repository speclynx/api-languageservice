import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const sourceDescriptionsTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SPEC_FIELD_SOURCE_DESCRIPTIONS_TYPE,
  source: 'apilint',
  message: 'sourceDescriptions must be an array of Source Description Objects',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayOfElementsOrClasses',
  linterParams: [['sourceDescription']],
  marker: 'key',
  target: 'sourceDescriptions',
  data: {},
  targetSpecs: [...arazzo],
};

export default sourceDescriptionsTypeLint;
