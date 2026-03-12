import inputsTypeLint from './inputs--type.ts';
import inputsValuesTypeLint from './inputs--values-type.ts';
import parametersTypeLint from './parameters--type.ts';
import parametersValuesTypeLint from './parameters--values-type.ts';
import successActionsTypeLint from './success-actions--type.ts';
import successActionsValuesTypeLint from './success-actions--values-type.ts';
import failureActionsTypeLint from './failure-actions--type.ts';
import failureActionsValuesTypeLint from './failure-actions--values-type.ts';
import allowedFieldsLint from './allowed-fields.ts';

const lints = [
  inputsTypeLint,
  inputsValuesTypeLint,
  parametersTypeLint,
  parametersValuesTypeLint,
  successActionsTypeLint,
  successActionsValuesTypeLint,
  failureActionsTypeLint,
  failureActionsValuesTypeLint,
  allowedFieldsLint,
];

export default lints;
