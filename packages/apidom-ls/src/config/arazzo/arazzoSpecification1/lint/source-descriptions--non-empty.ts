import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { arazzo } from '../../target-specs.ts';

const sourceDescriptionsNonEmptyLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_SPEC_FIELD_SOURCE_DESCRIPTIONS_NON_EMPTY,
  source: 'apilint',
  message: 'sourceDescriptions must have at least one entry',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintArrayNotEmpty',
  marker: 'key',
  target: 'sourceDescriptions',
  data: {},
  targetSpecs: [...arazzo],
};

export default sourceDescriptionsNonEmptyLint;
