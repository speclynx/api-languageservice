import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../../arazzo/target-specs.ts';
import { AsyncAPI2 } from '../../../asyncapi/target-specs.ts';
import { OpenAPI31 } from '../../../openapi/target-specs.ts';

const patternPropertiesTypeLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_PATTERNPROPERTIES_OBJECT,
  source: 'apilint',
  message: 'patternProperties must be an object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['object'],
  marker: 'value',
  target: 'patternProperties',
  data: {},
  targetSpecs: [...AsyncAPI2, ...OpenAPI31, ...Arazzo],
};

export default patternPropertiesTypeLint;
