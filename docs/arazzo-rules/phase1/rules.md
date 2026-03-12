# Phase 1: Arazzo Linting Rules Reference

This document lists all linting rules implemented in Phase 1 for the Arazzo 1.0.1 specification. Rules are organized by target element. Each rule includes its error code, linter function, and a brief description.

## Info Object (target: `info`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_INFO_FIELD_TITLE_REQUIRED | title--required | title field is required |
| ARAZZO_INFO_FIELD_TITLE_TYPE | title--type | title must be a string |
| ARAZZO_INFO_FIELD_DESCRIPTION_TYPE | description--type | description must be a string |
| ARAZZO_INFO_FIELD_SUMMARY_TYPE | summary--type | summary must be a string |
| ARAZZO_INFO_FIELD_VERSION_REQUIRED | version--required | version field is required |
| ARAZZO_INFO_FIELD_VERSION_TYPE | version--type | version must be a string |
| NOT_ALLOWED_FIELDS | allowed-fields-2-0--3-0 | Only title, description, summary, version + x- allowed |

## Arazzo Specification Object (target: `arazzoSpecification1`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_SPEC_FIELD_ARAZZO_REQUIRED | arazzo--required | arazzo version field required |
| ARAZZO_SPEC_FIELD_ARAZZO_TYPE | arazzo--type | arazzo must be a string |
| ARAZZO_SPEC_FIELD_ARAZZO_PATTERN | arazzo--pattern | arazzo must match ^1\.0\.\d+(-.+)?$ |
| ARAZZO_SPEC_FIELD_INFO_REQUIRED | info--required | info field required |
| ARAZZO_SPEC_FIELD_INFO_TYPE | info--type | info must be an info object |
| ARAZZO_SPEC_FIELD_SOURCE_DESCRIPTIONS_REQUIRED | source-descriptions--required | sourceDescriptions required |
| ARAZZO_SPEC_FIELD_SOURCE_DESCRIPTIONS_TYPE | source-descriptions--type | sourceDescriptions must be array of sourceDescription |
| ARAZZO_SPEC_FIELD_SOURCE_DESCRIPTIONS_NON_EMPTY | source-descriptions--non-empty | sourceDescriptions must have at least one entry |
| ARAZZO_SPEC_FIELD_WORKFLOWS_REQUIRED | workflows--required | workflows required |
| ARAZZO_SPEC_FIELD_WORKFLOWS_TYPE | workflows--type | workflows must be array of workflow |
| ARAZZO_SPEC_FIELD_WORKFLOWS_NON_EMPTY | workflows--non-empty | workflows must have at least one entry |
| ARAZZO_SPEC_FIELD_COMPONENTS_TYPE | components--type | components must be a components object |
| NOT_ALLOWED_FIELDS | allowed-fields | Only arazzo, info, sourceDescriptions, workflows, components + x- |

## Source Description Object (target: `sourceDescription`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_REQUIRED | name--required | name field required |
| ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_TYPE | name--type | name must be a string |
| ARAZZO_SOURCE_DESCRIPTION_FIELD_NAME_PATTERN | name--pattern | name must match [A-Za-z0-9_\-]+ |
| ARAZZO_SOURCE_DESCRIPTION_FIELD_URL_REQUIRED | url--required | url field required |
| ARAZZO_SOURCE_DESCRIPTION_FIELD_URL_TYPE | url--type | url must be a string |
| ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_TYPE | type--type | type must be a string |
| ARAZZO_SOURCE_DESCRIPTION_FIELD_TYPE_EQUALS | type--equals | type must be openapi or arazzo |
| NOT_ALLOWED_FIELDS | allowed-fields | Only name, url, type + x- |

## Workflow Object (target: `workflow`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_WORKFLOW_FIELD_WORKFLOW_ID_REQUIRED | workflow-id--required | workflowId required |
| ARAZZO_WORKFLOW_FIELD_WORKFLOW_ID_TYPE | workflow-id--type | workflowId must be a string |
| ARAZZO_WORKFLOW_FIELD_WORKFLOW_ID_PATTERN | workflow-id--pattern | workflowId must match [A-Za-z0-9_\-]+ |
| ARAZZO_WORKFLOW_FIELD_SUMMARY_TYPE | summary--type | summary must be a string |
| ARAZZO_WORKFLOW_FIELD_DESCRIPTION_TYPE | description--type | description must be a string |
| ARAZZO_WORKFLOW_FIELD_INPUTS_TYPE | inputs--type | inputs must be a JSONSchema object |
| ARAZZO_WORKFLOW_FIELD_STEPS_REQUIRED | steps--required | steps required |
| ARAZZO_WORKFLOW_FIELD_STEPS_TYPE | steps--type | steps must be array of step |
| ARAZZO_WORKFLOW_FIELD_STEPS_NON_EMPTY | steps--non-empty | steps must have at least one entry |
| ARAZZO_WORKFLOW_FIELD_DEPENDS_ON_TYPE | depends-on--type | dependsOn must be array of strings |
| ARAZZO_WORKFLOW_FIELD_SUCCESS_ACTIONS_TYPE | success-actions--type | successActions array of successAction/reusable |
| ARAZZO_WORKFLOW_FIELD_FAILURE_ACTIONS_TYPE | failure-actions--type | failureActions array of failureAction/reusable |
| ARAZZO_WORKFLOW_FIELD_OUTPUTS_TYPE | outputs--type | outputs must be an object |
| ARAZZO_WORKFLOW_FIELD_OUTPUTS_KEYS_PATTERN | outputs--keys-pattern | output keys match [a-zA-Z0-9.\-_]+ |
| ARAZZO_WORKFLOW_FIELD_PARAMETERS_TYPE | parameters--type | parameters array of parameter/reusable |
| NOT_ALLOWED_FIELDS | allowed-fields | Allowed fields list + x- |

## Step Object (target: `step`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_STEP_FIELD_STEP_ID_REQUIRED | step-id--required | stepId required |
| ARAZZO_STEP_FIELD_STEP_ID_TYPE | step-id--type | stepId must be a string |
| ARAZZO_STEP_FIELD_STEP_ID_PATTERN | step-id--pattern | stepId must match [A-Za-z0-9_\-]+ |
| ARAZZO_STEP_FIELD_DESCRIPTION_TYPE | description--type | description must be a string |
| ARAZZO_STEP_FIELD_OPERATION_ID_TYPE | operation-id--type | operationId must be a string |
| ARAZZO_STEP_FIELD_OPERATION_PATH_TYPE | operation-path--type | operationPath must be a string |
| ARAZZO_STEP_FIELD_WORKFLOW_ID_TYPE | workflow-id--type | workflowId must be a string |
| ARAZZO_STEP_FIELD_REQUEST_BODY_TYPE | request-body--type | requestBody must be a requestBody object |
| ARAZZO_STEP_FIELD_SUCCESS_CRITERIA_TYPE | success-criteria--type | successCriteria array of criterion |
| ARAZZO_STEP_FIELD_ON_SUCCESS_TYPE | on-success--type | onSuccess array of successAction/reusable |
| ARAZZO_STEP_FIELD_ON_FAILURE_TYPE | on-failure--type | onFailure array of failureAction/reusable |
| ARAZZO_STEP_FIELD_OUTPUTS_TYPE | outputs--type | outputs must be an object |
| ARAZZO_STEP_FIELD_OUTPUTS_KEYS_PATTERN | outputs--keys-pattern | output keys match [a-zA-Z0-9.\-_]+ |
| ARAZZO_STEP_FIELD_PARAMETERS_TYPE | parameters--type | parameters array of parameter/reusable |
| NOT_ALLOWED_FIELDS | allowed-fields | Allowed fields list + x- |

## Parameter Object (target: `parameter`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_PARAMETER_FIELD_NAME_REQUIRED | name--required | name required |
| ARAZZO_PARAMETER_FIELD_NAME_TYPE | name--type | name must be a string |
| ARAZZO_PARAMETER_FIELD_IN_TYPE | in--type | in must be a string |
| ARAZZO_PARAMETER_FIELD_IN_EQUALS | in--equals | in must be path/query/header/cookie/body |
| ARAZZO_PARAMETER_FIELD_VALUE_REQUIRED | value--required | value required |
| NOT_ALLOWED_FIELDS | allowed-fields | Only name, in, value + x- |

## Success Action Object (target: `successAction`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_SUCCESS_ACTION_FIELD_NAME_REQUIRED | name--required | name required |
| ARAZZO_SUCCESS_ACTION_FIELD_NAME_TYPE | name--type | name must be a string |
| ARAZZO_SUCCESS_ACTION_FIELD_TYPE_REQUIRED | type--required | type required |
| ARAZZO_SUCCESS_ACTION_FIELD_TYPE_TYPE | type--type | type must be a string |
| ARAZZO_SUCCESS_ACTION_FIELD_TYPE_EQUALS | type--equals | type must be end or goto |
| ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_TYPE | workflow-id--type | workflowId must be a string |
| ARAZZO_SUCCESS_ACTION_FIELD_STEP_ID_TYPE | step-id--type | stepId must be a string |
| ARAZZO_SUCCESS_ACTION_FIELD_CRITERIA_TYPE | criteria--type | criteria array of criterion |
| NOT_ALLOWED_FIELDS | allowed-fields | Allowed fields + x- |

## Failure Action Object (target: `failureAction`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_FAILURE_ACTION_FIELD_NAME_REQUIRED | name--required | name required |
| ARAZZO_FAILURE_ACTION_FIELD_NAME_TYPE | name--type | name must be a string |
| ARAZZO_FAILURE_ACTION_FIELD_TYPE_REQUIRED | type--required | type required |
| ARAZZO_FAILURE_ACTION_FIELD_TYPE_TYPE | type--type | type must be a string |
| ARAZZO_FAILURE_ACTION_FIELD_TYPE_EQUALS | type--equals | type must be end/goto/retry |
| ARAZZO_FAILURE_ACTION_FIELD_WORKFLOW_ID_TYPE | workflow-id--type | workflowId must be a string |
| ARAZZO_FAILURE_ACTION_FIELD_STEP_ID_TYPE | step-id--type | stepId must be a string |
| ARAZZO_FAILURE_ACTION_FIELD_RETRY_AFTER_TYPE | retry-after--type | retryAfter must be a number |
| ARAZZO_FAILURE_ACTION_FIELD_RETRY_AFTER_NON_NEGATIVE | retry-after--non-negative | retryAfter must be >= 0 |
| ARAZZO_FAILURE_ACTION_FIELD_RETRY_LIMIT_TYPE | retry-limit--type | retryLimit must be a number |
| ARAZZO_FAILURE_ACTION_FIELD_RETRY_LIMIT_NON_NEGATIVE | retry-limit--non-negative | retryLimit must be a non-negative integer |
| ARAZZO_FAILURE_ACTION_FIELD_CRITERIA_TYPE | criteria--type | criteria array of criterion |
| NOT_ALLOWED_FIELDS | allowed-fields | Allowed fields + x- |

## Components Object (target: `components`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_COMPONENTS_FIELD_INPUTS_TYPE | inputs--type | inputs must be an object |
| ARAZZO_COMPONENTS_FIELD_INPUTS_VALUES_TYPE | inputs--values-type | inputs values must be JSONSchema |
| ARAZZO_COMPONENTS_FIELD_PARAMETERS_TYPE | parameters--type | parameters must be an object |
| ARAZZO_COMPONENTS_FIELD_PARAMETERS_VALUES_TYPE | parameters--values-type | parameters values must be parameter |
| ARAZZO_COMPONENTS_FIELD_SUCCESS_ACTIONS_TYPE | success-actions--type | successActions must be an object |
| ARAZZO_COMPONENTS_FIELD_SUCCESS_ACTIONS_VALUES_TYPE | success-actions--values-type | successActions values must be successAction |
| ARAZZO_COMPONENTS_FIELD_FAILURE_ACTIONS_TYPE | failure-actions--type | failureActions must be an object |
| ARAZZO_COMPONENTS_FIELD_FAILURE_ACTIONS_VALUES_TYPE | failure-actions--values-type | failureActions values must be failureAction |
| NOT_ALLOWED_FIELDS | allowed-fields | Only inputs, parameters, successActions, failureActions + x- |

## Criterion Object (target: `criterion`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_CRITERION_FIELD_CONDITION_REQUIRED | condition--required | condition required |
| ARAZZO_CRITERION_FIELD_CONDITION_TYPE | condition--type | condition must be a string |
| ARAZZO_CRITERION_FIELD_CONTEXT_TYPE | context--type | context must be a string |
| ARAZZO_CRITERION_FIELD_TYPE_EQUALS | type--equals | type must be simple/regex/jsonpath/xpath (when string) |
| NOT_ALLOWED_FIELDS | allowed-fields | Only context, condition, type + x- |

## Criterion Expression Type Object (target: `criterionExpressionType`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_CRITERION_EXPRESSION_TYPE_FIELD_TYPE_REQUIRED | type--required | type required |
| ARAZZO_CRITERION_EXPRESSION_TYPE_FIELD_TYPE_TYPE | type--type | type must be a string |
| ARAZZO_CRITERION_EXPRESSION_TYPE_FIELD_TYPE_EQUALS | type--equals | type must be jsonpath or xpath |
| ARAZZO_CRITERION_EXPRESSION_TYPE_FIELD_VERSION_REQUIRED | version--required | version required |
| ARAZZO_CRITERION_EXPRESSION_TYPE_FIELD_VERSION_TYPE | version--type | version must be a string |
| NOT_ALLOWED_FIELDS | allowed-fields | Only type, version + x- |

## Request Body Object (target: `requestBody`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_REQUEST_BODY_FIELD_CONTENT_TYPE_TYPE | content-type--type | contentType must be a string |
| ARAZZO_REQUEST_BODY_FIELD_REPLACEMENTS_TYPE | replacements--type | replacements array of payloadReplacement |
| NOT_ALLOWED_FIELDS | allowed-fields | Only contentType, payload, replacements + x- |

## Payload Replacement Object (target: `payloadReplacement`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_PAYLOAD_REPLACEMENT_FIELD_TARGET_REQUIRED | target--required | target required |
| ARAZZO_PAYLOAD_REPLACEMENT_FIELD_TARGET_TYPE | target--type | target must be a string |
| ARAZZO_PAYLOAD_REPLACEMENT_FIELD_VALUE_REQUIRED | value--required | value required |
| NOT_ALLOWED_FIELDS | allowed-fields | Only target, value + x- |

## Reusable Object (target: `reusable`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_REUSABLE_FIELD_REFERENCE_REQUIRED | reference--required | reference required |
| ARAZZO_REUSABLE_FIELD_REFERENCE_TYPE | reference--type | reference must be a string |
| ARAZZO_REUSABLE_FIELD_VALUE_TYPE | value--type | value must be a string |
| NOT_ALLOWED_FIELDS | allowed-fields | Only reference, value (NO extensions) |

## JSON Schema Rules (target: `JSONSchema`)

JSON Schema rules are inherited from the existing implementation and cover type validation, constraints, pattern properties, and structural checks for JSON Schema 2020-12 used within Arazzo workflow inputs and components.
