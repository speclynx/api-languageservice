import stepIdRequiredLint from './step-id--required.ts';
import stepIdTypeLint from './step-id--type.ts';
import stepIdPatternLint from './step-id--pattern.ts';
import descriptionTypeLint from './description--type.ts';
import descriptionNoScriptTagsLint from './description--no-script-tags.ts';
import operationIdTypeLint from './operation-id--type.ts';
import operationPathTypeLint from './operation-path--type.ts';
import channelPathTypeLint from './channel-path--type.ts';
import workflowIdTypeLint from './workflow-id--type.ts';
import workflowIdPatternLint from './workflow-id--pattern.ts';
import requestBodyTypeLint from './request-body--type.ts';
import successCriteriaTypeLint from './success-criteria--type.ts';
import onSuccessTypeLint from './on-success--type.ts';
import onFailureTypeLint from './on-failure--type.ts';
import outputsTypeLint from './outputs--type.ts';
import outputsKeysPatternLint from './outputs--keys-pattern.ts';
import outputsValuesType10Lint from './outputs--values-type-1-0.ts';
import outputsValuesType11Lint from './outputs--values-type-1-1.ts';
import parametersTypeLint from './parameters--type.ts';
import operationIdMutuallyExclusiveLint from './operation-id--mutually-exclusive.ts';
import operationPathMutuallyExclusiveLint from './operation-path--mutually-exclusive.ts';
import channelPathMutuallyExclusiveLint from './channel-path--mutually-exclusive.ts';
import workflowIdMutuallyExclusiveLint from './workflow-id--mutually-exclusive.ts';
import descriptionRecommendedLint from './description--recommended.ts';
import operationPathPreferOperationIdLint from './operation-path--prefer-operation-id.ts';
import stepIdUniqueLint from './step-id--unique.ts';
import outputsNamesUniqueLint from './outputs--names-unique.ts';
import outputsValuesRuntimeExpressionLint from './outputs--values-runtime-expression.ts';
import workflowIdResolvedLint from './workflow-id--resolved.ts';
import timeoutTypeLint from './timeout--type.ts';
import correlationIdRequiresActionLint from './correlation-id--requires-action.ts';
import correlationIdOnlyActionReceiveLint from './correlation-id--only-action-receive.ts';
import actionTypeLint from './action--type.ts';
import actionEqualsLint from './action--equals.ts';
import dependsOnTypeLint from './depends-on--type.ts';
import dependsOnUniqueLint from './depends-on--unique.ts';
import dependsOnResolvedLint from './depends-on--resolved.ts';
import operationIdSourceTypeConsistency10Lint from './operation-id--source-type-consistency-1-0.ts';
import operationIdSourceTypeConsistency11Lint from './operation-id--source-type-consistency-1-1.ts';
import workflowIdSourceTypeConsistencyLint from './workflow-id--source-type-consistency.ts';
import dependsOnSourceTypeConsistencyLint from './depends-on--source-type-consistency.ts';
import allowedFields10Lint from './allowed-fields-1-0.ts';
import allowedFields11Lint from './allowed-fields-1-1.ts';

const lints = [
  stepIdRequiredLint,
  stepIdTypeLint,
  stepIdPatternLint,
  stepIdUniqueLint,
  descriptionTypeLint,
  descriptionNoScriptTagsLint,
  descriptionRecommendedLint,
  operationIdTypeLint,
  operationPathTypeLint,
  channelPathTypeLint,
  workflowIdTypeLint,
  workflowIdPatternLint,
  operationIdMutuallyExclusiveLint,
  operationPathMutuallyExclusiveLint,
  channelPathMutuallyExclusiveLint,
  workflowIdMutuallyExclusiveLint,
  operationPathPreferOperationIdLint,
  workflowIdResolvedLint,
  requestBodyTypeLint,
  successCriteriaTypeLint,
  onSuccessTypeLint,
  onFailureTypeLint,
  outputsTypeLint,
  outputsNamesUniqueLint,
  outputsValuesRuntimeExpressionLint,
  outputsKeysPatternLint,
  outputsValuesType10Lint,
  outputsValuesType11Lint,
  parametersTypeLint,
  timeoutTypeLint,
  correlationIdRequiresActionLint,
  correlationIdOnlyActionReceiveLint,
  actionTypeLint,
  actionEqualsLint,
  dependsOnTypeLint,
  dependsOnUniqueLint,
  dependsOnResolvedLint,
  operationIdSourceTypeConsistency10Lint,
  operationIdSourceTypeConsistency11Lint,
  workflowIdSourceTypeConsistencyLint,
  dependsOnSourceTypeConsistencyLint,
  allowedFields10Lint,
  allowedFields11Lint,
];

export default lints;
