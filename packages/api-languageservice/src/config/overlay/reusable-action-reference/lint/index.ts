import refTypeLint from './$ref--type.ts';
import refFormatLint from './$ref--format.ts';
import targetRequiredLint from './target--required.ts';
import targetTypeLint from './target--type.ts';
import targetJSONPathValidLint from './target--jsonpath-valid.ts';
import descriptionTypeLint from './description--type.ts';
import descriptionNoScriptTagsLint from './description--no-script-tags.ts';
import allowedFieldsLint from './allowed-fields.ts';

const lints = [
  refTypeLint,
  refFormatLint,
  targetRequiredLint,
  targetTypeLint,
  targetJSONPathValidLint,
  descriptionTypeLint,
  descriptionNoScriptTagsLint,
  allowedFieldsLint,
];

export default lints;
