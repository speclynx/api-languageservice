import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const propertiesValuesTypeLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_PROPERTIES,
  source: 'apilint',
  message: 'properties members must be JSON Schema',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintChildrenOfElementsOrClasses',
  linterParams: [['JSONSchema', 'boolean']],
  marker: 'key',
  markerTarget: 'properties',
  target: 'properties',
  data: {},
  targetSpecs: Arazzo,
};

export default propertiesValuesTypeLint;
