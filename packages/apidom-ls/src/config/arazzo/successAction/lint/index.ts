import nameRequiredLint from './name--required.ts';
import nameTypeLint from './name--type.ts';
import typeRequiredLint from './type--required.ts';
import typeTypeLint from './type--type.ts';
import typeEqualsLint from './type--equals.ts';
import workflowIdTypeLint from './workflow-id--type.ts';
import workflowIdPatternLint from './workflow-id--pattern.ts';
import workflowIdSourceTypeConsistencyLint from './workflow-id--source-type-consistency.ts';
import stepIdTypeLint from './step-id--type.ts';
import stepIdPatternLint from './step-id--pattern.ts';
import criteriaTypeLint from './criteria--type.ts';
import parametersTypeLint from './parameters--type.ts';
import parametersOnlyWorkflowIdLint from './parameters--only-workflow-id.ts';
import workflowIdMutuallyExclusiveLint from './workflow-id--mutually-exclusive.ts';
import stepIdMutuallyExclusiveLint from './step-id--mutually-exclusive.ts';
import workflowIdResolvedLint from './workflow-id--resolved.ts';
import stepIdResolvedLint from './step-id--resolved.ts';
import nameUniqueLint from './name--unique.ts';
import allowedFields10Lint from './allowed-fields-1-0.ts';
import allowedFields11Lint from './allowed-fields-1-1.ts';

const lints = [
  nameRequiredLint,
  nameTypeLint,
  nameUniqueLint,
  typeRequiredLint,
  typeTypeLint,
  typeEqualsLint,
  workflowIdTypeLint,
  workflowIdPatternLint,
  workflowIdSourceTypeConsistencyLint,
  stepIdTypeLint,
  stepIdPatternLint,
  workflowIdMutuallyExclusiveLint,
  stepIdMutuallyExclusiveLint,
  workflowIdResolvedLint,
  stepIdResolvedLint,
  criteriaTypeLint,
  parametersTypeLint,
  parametersOnlyWorkflowIdLint,
  allowedFields10Lint,
  allowedFields11Lint,
];

export default lints;
