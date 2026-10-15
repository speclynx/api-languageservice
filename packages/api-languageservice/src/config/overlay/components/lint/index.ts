import actionsTypeLint from './actions--type.ts';
import actionsValuesTypeLint from './actions--values-type.ts';
import allowedFieldsLint from './allowed-fields.ts';

const lints = [actionsTypeLint, actionsValuesTypeLint, allowedFieldsLint];

export default lints;
