import titleRequiredLint from './title--required.ts';
import titleTypeLint from './title--type.ts';
import titleNoScriptTagsLint from './title--no-script-tags.ts';
import versionRequiredLint from './version--required.ts';
import versionTypeLint from './version--type.ts';
import descriptionTypeLint from './description--type.ts';
import descriptionNoScriptTagsLint from './description--no-script-tags.ts';
import allowedFields10Lint from './allowed-fields-1-0.ts';
import allowedFields11Lint from './allowed-fields-1-1.ts';

const lints = [
  titleRequiredLint,
  titleTypeLint,
  titleNoScriptTagsLint,
  versionRequiredLint,
  versionTypeLint,
  descriptionTypeLint,
  descriptionNoScriptTagsLint,
  allowedFields10Lint,
  allowedFields11Lint,
];

export default lints;
