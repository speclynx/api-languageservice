import { DiagnosticSeverity } from 'vscode-languageserver-types';

import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { Arazzo11 } from '../../target-specs.ts';

const channelPathTypeLint: LinterMeta = {
  code: ApilintCodes.ARAZZO_STEP_FIELD_CHANNEL_PATH_TYPE,
  source: 'apilint',
  message: 'channelPath must be a string',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'channelPath',
  data: {},
  targetSpecs: [...Arazzo11],
};

export default channelPathTypeLint;
