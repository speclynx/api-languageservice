import targetRequiredLint from './target--required.ts';
import targetTypeLint from './target--type.ts';
import targetJSONPathValidLint from './target--jsonpath-valid.ts';
import descriptionTypeLint from './description--type.ts';
import descriptionNoScriptTagsLint from './description--no-script-tags.ts';
import copyTypeLint from './copy--type.ts';
import copyJSONPathValidLint from './copy--jsonpath-valid.ts';
import removeTypeLint from './remove--type.ts';
import updateCopyMutuallyExclusiveLint from './update-copy--mutually-exclusive.ts';
import updateRemoveMutuallyExclusive10Lint from './update-remove--mutually-exclusive-1-0.ts';
import updateRemoveMutuallyExclusive11Lint from './update-remove--mutually-exclusive-1-1.ts';
import copyRemoveMutuallyExclusiveLint from './copy-remove--mutually-exclusive.ts';
import allowedFields10Lint from './allowed-fields-1-0.ts';
import allowedFields11Lint from './allowed-fields-1-1.ts';

const lints = [
  targetRequiredLint,
  targetTypeLint,
  targetJSONPathValidLint,
  descriptionTypeLint,
  descriptionNoScriptTagsLint,
  copyTypeLint,
  copyJSONPathValidLint,
  removeTypeLint,
  updateCopyMutuallyExclusiveLint,
  updateRemoveMutuallyExclusive10Lint,
  updateRemoveMutuallyExclusive11Lint,
  copyRemoveMutuallyExclusiveLint,
  allowedFields10Lint,
  allowedFields11Lint,
];

export default lints;
