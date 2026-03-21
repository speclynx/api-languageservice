import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../../arazzo/target-specs.ts';
import { OpenAPI31 } from '../../../openapi/target-specs.ts';
import { AsyncAPI2 } from '../../../asyncapi/target-specs.ts';

const propertyNamesTypeLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_PROPERTYNAMES,
  source: 'apilint',
  message: 'propertyNames must be a schema object or a boolean JSON schema',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintElementOrClass',
  linterParams: [['schema', 'JSONSchema', 'JSONSchema202012', 'boolean']],
  marker: 'value',
  target: 'propertyNames',
  data: {},
  targetSpecs: [...OpenAPI31, ...AsyncAPI2, ...Arazzo],
};

export default propertyNamesTypeLint;
