import descriptionTypeLint from './description--type.ts';
import descriptionNoScriptTagsLint from './description--no-script-tags.ts';
import fieldsTypeLint from './fields--type.ts';
import allowedFieldsLint from './allowed-fields.ts';

const lints = [descriptionTypeLint, descriptionNoScriptTagsLint, fieldsTypeLint, allowedFieldsLint];

export default lints;
