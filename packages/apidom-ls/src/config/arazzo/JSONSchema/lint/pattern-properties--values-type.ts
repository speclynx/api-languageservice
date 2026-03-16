import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo } from '../../target-specs.ts';

const patternPropertiesValuesTypeLint: LinterMeta = {
  code: ApilintCodes.SCHEMA_PATTERNPROPERTIES,
  source: 'apilint',
  message: 'patternProperties members must be schema objects or boolean JSON schemas',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintChildrenOfElementsOrClasses',
  linterParams: [['JSONSchema', 'boolean']],
  marker: 'key',
  markerTarget: 'patternProperties',
  target: 'patternProperties',
  data: {},
  targetSpecs: Arazzo,
};

export default patternPropertiesValuesTypeLint;
