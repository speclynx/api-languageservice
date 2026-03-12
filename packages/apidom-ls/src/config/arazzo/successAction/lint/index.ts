import nameRequiredLint from './name--required.ts';
import nameTypeLint from './name--type.ts';
import typeRequiredLint from './type--required.ts';
import typeTypeLint from './type--type.ts';
import typeEqualsLint from './type--equals.ts';
import workflowIdTypeLint from './workflow-id--type.ts';
import stepIdTypeLint from './step-id--type.ts';
import criteriaTypeLint from './criteria--type.ts';
import allowedFieldsLint from './allowed-fields.ts';

const lints = [
  nameRequiredLint,
  nameTypeLint,
  typeRequiredLint,
  typeTypeLint,
  typeEqualsLint,
  workflowIdTypeLint,
  stepIdTypeLint,
  criteriaTypeLint,
  allowedFieldsLint,
];

export default lints;
