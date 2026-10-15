import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Overlay12 } from '../../target-specs.ts';

const componentsTypeLint: LinterMeta = {
  code: ApilintCodes.OVERLAY_SPEC_FIELD_COMPONENTS_TYPE,
  source: 'apilint',
  message: 'components must be a Components Object',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintElementOrClass',
  linterParams: [['components']],
  marker: 'key',
  target: 'components',
  data: {},
  targetSpecs: [...Overlay12],
};

export default componentsTypeLint;
