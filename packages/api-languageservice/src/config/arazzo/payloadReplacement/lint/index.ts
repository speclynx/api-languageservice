import targetRequiredLint from './target--required.ts';
import targetTypeLint from './target--type.ts';
import targetSelectorTypeTypeLint from './target-selector-type--type.ts';
import targetSelectorTypeEqualsLint from './target-selector-type--equals.ts';
import valueRequiredLint from './value--required.ts';
import allowedFields10Lint from './allowed-fields-1-0.ts';
import allowedFields11Lint from './allowed-fields-1-1.ts';

const lints = [
  targetRequiredLint,
  targetTypeLint,
  targetSelectorTypeTypeLint,
  targetSelectorTypeEqualsLint,
  valueRequiredLint,
  allowedFields10Lint,
  allowedFields11Lint,
];

export default lints;
