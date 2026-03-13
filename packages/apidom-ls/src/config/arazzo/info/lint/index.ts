import allowedFieldsLint from './allowed-fields.ts';
import titleRequiredLint from './title--required.ts';
import titleTypeLint from './title--type.ts';
import descriptionTypeLint from './description--type.ts';
import summaryTypeLint from './summary--type.ts';
import versionRequiredLint from './version--required.ts';
import versionTypeLint from './version--type.ts';

const lints = [
  titleRequiredLint,
  titleTypeLint,
  descriptionTypeLint,
  summaryTypeLint,
  versionRequiredLint,
  versionTypeLint,
  allowedFieldsLint,
];

export default lints;
