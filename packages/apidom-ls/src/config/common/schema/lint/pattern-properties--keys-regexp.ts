import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../../arazzo/target-specs.ts';
import { AsyncAPI2 } from '../../../asyncapi/target-specs.ts';
import { OpenAPI31 } from '../../../openapi/target-specs.ts';

const patternPropertiesKeysRegexpLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_PATTERNPROPERTIES_KEY,
  source: 'apilint',
  message: 'patternProperties keys must be valid regex',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintChildrenKeysAreRegex',
  marker: 'key',
  target: 'patternProperties',
  markerTarget: 'patternProperties',
  data: {},
  targetSpecs: [...AsyncAPI2, ...OpenAPI31, ...Arazzo],
};

export default patternPropertiesKeysRegexpLint;
