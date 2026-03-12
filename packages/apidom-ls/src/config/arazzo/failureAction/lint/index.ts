import nameRequiredLint from './name--required.ts';
import nameTypeLint from './name--type.ts';
import typeRequiredLint from './type--required.ts';
import typeTypeLint from './type--type.ts';
import typeEqualsLint from './type--equals.ts';
import workflowIdTypeLint from './workflow-id--type.ts';
import stepIdTypeLint from './step-id--type.ts';
import retryAfterTypeLint from './retry-after--type.ts';
import retryAfterNonNegativeLint from './retry-after--non-negative.ts';
import retryLimitTypeLint from './retry-limit--type.ts';
import retryLimitNonNegativeLint from './retry-limit--non-negative.ts';
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
  retryAfterTypeLint,
  retryAfterNonNegativeLint,
  retryLimitTypeLint,
  retryLimitNonNegativeLint,
  criteriaTypeLint,
  allowedFieldsLint,
];

export default lints;
