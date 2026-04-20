import allowedFieldsLint from './allowed-fields.ts';
import titleRequiredLint from './title--required.ts';
import titleTypeLint from './title--type.ts';
import titleNoScriptTagsLint from './title--no-script-tags.ts';
import descriptionTypeLint from './description--type.ts';
import descriptionNoScriptTagsLint from './description--no-script-tags.ts';
import summaryTypeLint from './summary--type.ts';
import summaryNoScriptTagsLint from './summary--no-script-tags.ts';
import versionRequiredLint from './version--required.ts';
import versionTypeLint from './version--type.ts';
import descriptionRecommendedLint from './description--recommended.ts';
import summaryRecommendedLint from './summary--recommended.ts';

const lints = [
  titleRequiredLint,
  titleTypeLint,
  titleNoScriptTagsLint,
  descriptionTypeLint,
  descriptionNoScriptTagsLint,
  descriptionRecommendedLint,
  summaryTypeLint,
  summaryNoScriptTagsLint,
  summaryRecommendedLint,
  versionRequiredLint,
  versionTypeLint,
  allowedFieldsLint,
];

export default lints;
