import arazzoRequiredLint from './arazzo--required.ts';
import arazzoTypeLint from './arazzo--type.ts';
import arazzoPatternLint from './arazzo--pattern.ts';
import $selfTypeLint from './$self--type.ts';
import $selfFormatURILint from './$self--format-uri.ts';
import $selfNoFragmentLint from './$self--no-fragment.ts';
import infoRequiredLint from './info--required.ts';
import infoTypeLint from './info--type.ts';
import sourceDescriptionsRequiredLint from './source-descriptions--required.ts';
import sourceDescriptionsTypeLint from './source-descriptions--type.ts';
import sourceDescriptionsNonEmptyLint from './source-descriptions--non-empty.ts';
import workflowsRequiredLint from './workflows--required.ts';
import workflowsTypeLint from './workflows--type.ts';
import workflowsNonEmptyLint from './workflows--non-empty.ts';
import componentsTypeLint from './components--type.ts';
import allowedFields10Lint from './allowed-fields-1-0.ts';
import allowedFields11Lint from './allowed-fields-1-1.ts';

const lints = [
  arazzoRequiredLint,
  arazzoTypeLint,
  arazzoPatternLint,
  $selfTypeLint,
  $selfFormatURILint,
  $selfNoFragmentLint,
  infoRequiredLint,
  infoTypeLint,
  sourceDescriptionsRequiredLint,
  sourceDescriptionsTypeLint,
  sourceDescriptionsNonEmptyLint,
  workflowsRequiredLint,
  workflowsTypeLint,
  workflowsNonEmptyLint,
  componentsTypeLint,
  allowedFields10Lint,
  allowedFields11Lint,
];

export default lints;
