# Arazzo Linting Rules Reference (Phase 4)

This document lists all linting rules implemented for the Arazzo 1.0.1 specification, including JSON Schema rules tested in Phase 4. Rules are organized by target element. Each rule includes its error code, linter function, and a brief description.

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
| ARAZZO_WORKFLOW_FIELD_OUTPUTS_VALUES_TYPE | outputs--values-type | output values must be strings (Runtime Expressions) |
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
| ARAZZO_STEP_FIELD_OUTPUTS_VALUES_TYPE | outputs--values-type | output values must be strings (Runtime Expressions) |
| ARAZZO_STEP_FIELD_PARAMETERS_TYPE | parameters--type | parameters array of parameter/reusable |
| ARAZZO_STEP_FIELD_OPERATION_ID_MUTUALLY_EXCLUSIVE | operation-id--mutually-exclusive | operationId is mutually exclusive with operationPath and workflowId |
| ARAZZO_STEP_FIELD_OPERATION_PATH_MUTUALLY_EXCLUSIVE | operation-path--mutually-exclusive | operationPath is mutually exclusive with operationId and workflowId |
| ARAZZO_STEP_FIELD_WORKFLOW_ID_MUTUALLY_EXCLUSIVE | workflow-id--mutually-exclusive | workflowId is mutually exclusive with operationId and operationPath |
| NOT_ALLOWED_FIELDS | allowed-fields | Allowed fields list + x- |

## Parameter Object (target: `parameter`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_PARAMETER_FIELD_NAME_REQUIRED | name--required | name required |
| ARAZZO_PARAMETER_FIELD_NAME_TYPE | name--type | name must be a string |
| ARAZZO_PARAMETER_FIELD_IN_TYPE | in--type | in must be a string |
| ARAZZO_PARAMETER_FIELD_IN_EQUALS | in--equals | in must be path/query/header/cookie |
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
| ARAZZO_SUCCESS_ACTION_FIELD_WORKFLOW_ID_MUTUALLY_EXCLUSIVE | workflow-id--mutually-exclusive | workflowId is mutually exclusive with stepId |
| ARAZZO_SUCCESS_ACTION_FIELD_STEP_ID_MUTUALLY_EXCLUSIVE | step-id--mutually-exclusive | stepId is mutually exclusive with workflowId |
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
| ARAZZO_FAILURE_ACTION_FIELD_WORKFLOW_ID_MUTUALLY_EXCLUSIVE | workflow-id--mutually-exclusive | workflowId is mutually exclusive with stepId |
| ARAZZO_FAILURE_ACTION_FIELD_STEP_ID_MUTUALLY_EXCLUSIVE | step-id--mutually-exclusive | stepId is mutually exclusive with workflowId |
| ARAZZO_FAILURE_ACTION_FIELD_RETRY_AFTER_ONLY_RETRY | retry-after--only-retry | retryAfter only applies when type is "retry" |
| ARAZZO_FAILURE_ACTION_FIELD_RETRY_LIMIT_ONLY_RETRY | retry-limit--only-retry | retryLimit only applies when type is "retry" |
| NOT_ALLOWED_FIELDS | allowed-fields | Allowed fields + x- |

## Components Object (target: `components`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_COMPONENTS_FIELD_INPUTS_TYPE | inputs--type | inputs must be an object |
| ARAZZO_COMPONENTS_FIELD_INPUTS_VALUES_TYPE | inputs--values-type | inputs values must be JSONSchema |
| ARAZZO_COMPONENTS_FIELD_INPUTS_KEYS_PATTERN | inputs--keys-pattern | inputs keys match [a-zA-Z0-9.\-_]+ |
| ARAZZO_COMPONENTS_FIELD_PARAMETERS_TYPE | parameters--type | parameters must be an object |
| ARAZZO_COMPONENTS_FIELD_PARAMETERS_VALUES_TYPE | parameters--values-type | parameters values must be parameter |
| ARAZZO_COMPONENTS_FIELD_PARAMETERS_KEYS_PATTERN | parameters--keys-pattern | parameters keys match [a-zA-Z0-9.\-_]+ |
| ARAZZO_COMPONENTS_FIELD_SUCCESS_ACTIONS_TYPE | success-actions--type | successActions must be an object |
| ARAZZO_COMPONENTS_FIELD_SUCCESS_ACTIONS_VALUES_TYPE | success-actions--values-type | successActions values must be successAction |
| ARAZZO_COMPONENTS_FIELD_SUCCESS_ACTIONS_KEYS_PATTERN | success-actions--keys-pattern | successActions keys match [a-zA-Z0-9.\-_]+ |
| ARAZZO_COMPONENTS_FIELD_FAILURE_ACTIONS_TYPE | failure-actions--type | failureActions must be an object |
| ARAZZO_COMPONENTS_FIELD_FAILURE_ACTIONS_VALUES_TYPE | failure-actions--values-type | failureActions values must be failureAction |
| ARAZZO_COMPONENTS_FIELD_FAILURE_ACTIONS_KEYS_PATTERN | failure-actions--keys-pattern | failureActions keys match [a-zA-Z0-9.\-_]+ |
| NOT_ALLOWED_FIELDS | allowed-fields | Only inputs, parameters, successActions, failureActions + x- |

## Criterion Object (target: `criterion`)

| Code | Rule File | Description |
|------|-----------|-------------|
| ARAZZO_CRITERION_FIELD_CONDITION_REQUIRED | condition--required | condition required |
| ARAZZO_CRITERION_FIELD_CONDITION_TYPE | condition--type | condition must be a string |
| ARAZZO_CRITERION_FIELD_CONTEXT_TYPE | context--type | context must be a string |
| ARAZZO_CRITERION_FIELD_TYPE_EQUALS | type--equals | type must be simple/regex/jsonpath/xpath (when string) |
| ARAZZO_CRITERION_FIELD_CONTEXT_REQUIRED_WHEN_TYPE | context--required-when-type | context MUST be provided when type is specified |
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

JSON Schema rules validate the `inputs` field of Workflow Objects and the `inputs` values in Components against JSON Schema 2020-12. The rules were reviewed and corrected to remove OpenAPI-specific validations that do not apply to the pure JSON Schema 2020-12 dialect used by Arazzo.

Removed rules (OpenAPI-specific, not applicable to Arazzo):

| Removed Rule | Reason |
|-------------|--------|
| allowed-fields-openapi-2-0 | OpenAPI 2.0 Schema Object fields, not JSON Schema 2020-12 |
| allowed-fields-openapi-3-0 | OpenAPI 3.0 Schema Object fields, not JSON Schema 2020-12 |
| discriminator--exist-in-required | discriminator is OpenAPI-specific |
| $ref--no-siblings | JSON Schema 2020-12 allows $ref siblings |
| nullable--type | nullable is OpenAPI 3.0 extension |
| nullable--not-recommended | nullable is OpenAPI 3.0 extension |
| xml--type | xml is OpenAPI-specific |
| external-docs--type | externalDocs is OpenAPI-specific |

Active rules (64 total):

| Code | Rule File | Description |
|------|-----------|-------------|
| NOT_ALLOWED_FIELDS | allowed-fields | JSON Schema 2020-12 keyword allowlist |
| SCHEMA_ID | $id--format-uri | $id must be a valid URI |
| SCHEMA_REF | $ref--valid | $ref must be a valid URI-reference |
| SCHEMA_ADDITIONALITEMS | additional-items--type | additionalItems must be a schema object |
| SCHEMA_ADDITIONALITEMS_NONARRAY | additional-items--non-array | additionalItems warns on non-array type |
| SCHEMA_ADDITIONALPROPERTIES | additional-properties--type | additionalProperties must be a schema object |
| SCHEMA_ADDITIONALPROPERTIES_NONOBJECT | additional-properties--non-object | additionalProperties warns on non-object type |
| SCHEMA_ALLOF | all-of--type | allOf must be an array of schemas |
| SCHEMA_ANYOF | any-of--type | anyOf must be an array of schemas |
| SCHEMA_CONTAINS | contains--type | contains must be a schema object |
| SCHEMA_CONTAINS_NONARRAY | contains--non-array | contains warns on non-array type |
| SCHEMA_DEPRECATED | deprecated--type | deprecated must be a boolean |
| SCHEMA_DESCRIPTION | description--type | description must be a string |
| SCHEMA_ELSE | else--type | else must be a schema object |
| SCHEMA_ELSE_NONIF | else--non-if | else warns without if |
| SCHEMA_ENUM | enum--unique | enum values must be unique |
| SCHEMA_EXAMPLES | examples--type | examples must be an array |
| SCHEMA_EXCLUSIVEMAXIMUM | exclusive-maximum--type-number | exclusiveMaximum must be a number (2020-12) |
| SCHEMA_EXCLUSIVEMAXIMUM | exclusive-maximum--type-boolean | exclusiveMaximum boolean (draft-04 compat) |
| SCHEMA_EXCLUSIVEMINUMUM | exclusive-minimum--type-number | exclusiveMinimum must be a number (2020-12) |
| SCHEMA_EXCLUSIVEMINUMUM | exclusive-minimum--type-boolean | exclusiveMinimum boolean (draft-04 compat) |
| SCHEMA_FORMAT | format--type | format must be a string |
| SCHEMA_IF | if--type | if must be a schema object |
| SCHEMA_IF_NONTHEN | if--non-then | if warns without then |
| SCHEMA_ITEMS | items--type | items must be a schema object |
| SCHEMA_ITEMS_NONARRAY | items--non-array | items warns on non-array type |
| SCHEMA_MAXITEMS | max-items--type | maxItems must be a non-negative integer |
| SCHEMA_MAXITEMS_NONARRAY | max-items--non-array | maxItems warns on non-array type |
| SCHEMA_MAXLENGTH | max-length--type | maxLength must be a non-negative integer |
| SCHEMA_MAXLENGTH_NONSTRING | max-length--non-string | maxLength warns on non-string type |
| SCHEMA_MAXIMUM | maximum--type | maximum must be a number |
| SCHEMA_MINITEMS | min-items--type | minItems must be a non-negative integer |
| SCHEMA_MINITEMS_NONARRAY | min-items--non-array | minItems warns on non-array type |
| SCHEMA_MINLENGTH | min-length--type | minLength must be a non-negative integer |
| SCHEMA_MINLENGTH_NONSTRING | min-length--non-string | minLength warns on non-string type |
| SCHEMA_MINPROPERTIES | min-properties--type | minProperties must be a non-negative integer |
| SCHEMA_MINPROPERTIES_NONOBJECT | min-properties--non-object | minProperties warns on non-object type |
| SCHEMA_MAXPROPERTIES | max-properties--type | maxProperties must be a non-negative integer |
| SCHEMA_MAXPROPERTIES_NONOBJECT | max-properties--non-object | maxProperties warns on non-object type |
| SCHEMA_MINUMUM | minimum--type | minimum must be a number |
| SCHEMA_MISSING_CORE_FIELDS | missing-core-fields | Hint when object has no schema keywords |
| SCHEMA_MULTIPLEOF | multiple-of--type | multipleOf must be a number > 0 |
| SCHEMA_NOT | not--type | not must be a schema object |
| SCHEMA_ONEOF | one-of--type | oneOf must be an array of schemas |
| SCHEMA_PATTERN | pattern--type | pattern must be a string |
| SCHEMA_PATTERNPROPERTIES_KEY | pattern-properties--keys-regexp | patternProperties keys must be valid regexps |
| SCHEMA_PATTERNPROPERTIES_NONOBJECT | pattern-properties--non-object | patternProperties warns on non-object type |
| SCHEMA_PATTERNPROPERTIES | pattern-properties--type | patternProperties must be an object |
| SCHEMA_PATTERNPROPERTIES_OBJECT | pattern-properties--values-type | patternProperties values must be schemas |
| SCHEMA_PROPERTIES | properties--type | properties must be an object |
| SCHEMA_PROPERTIES_OBJECT | properties--values-type | properties values must be schemas |
| SCHEMA_PROPERTIES_NONOBJECT | properties--non-object | properties warns on non-object type |
| SCHEMA_PROPERTYNAMES | property-names--type | propertyNames must be a schema object |
| SCHEMA_PROPERTYNAMES_NONOBJECT | property-names--non-object | propertyNames warns on non-object type |
| SCHEMA_READONLY | read-only--type | readOnly must be a boolean |
| SCHEMA_REQUIRED | required--type | required must be an array |
| SCHEMA_REQUIRED_NONOBJECT | required--non-object | required warns on non-object type |
| SCHEMA_REQUIRED_WITHOUT_PROPERTIES | required--defined | required warns without properties |
| SCHEMA_THEN | then--type | then must be a schema object |
| SCHEMA_THEN_NONIF | then--non-if | then warns without if |
| SCHEMA_TITLE | title--type | title must be a string |
| SCHEMA_TYPE | type--type | type must be a string |
| SCHEMA_TYPE | type--equals | type must be a valid JSON Schema type |
| SCHEMA_UNIQUEITEMS | unique-items--type | uniqueItems must be a boolean |
| SCHEMA_UNIQUEITEMS_NONARRAY | unique-items--non-array | uniqueItems warns on non-array type |
| SCHEMA_WRITEONLY | write-only--type | writeOnly must be a boolean |
| SCHEMA_EXAMPLE_DEPRECATED | example--deprecated | example deprecated in favor of examples |
| SCHEMA_TYPE_ARRAY_NON_ITEMS | type--array-non-items | type: array requires items field |
| JSON_SCHEMA_2020_12_KEYWORD_$ID_FORMAT_URI | $id--format-uri | $id must be valid URI-reference |
| JSON_SCHEMA_2020_12_KEYWORD_$SCHEMA_FORMAT_URI | $schema--format-uri | $schema must be valid URI with scheme |
| JSON_SCHEMA_2020_12_KEYWORD_$REF_FORMAT_URI | $ref--format-uri | $ref must be valid URI-reference |
| JSON_SCHEMA_2020_12_KEYWORD_$COMMENT_TYPE | $comment--type | $comment must be a string |

## Phase 4 Test Status

All JSON Schema rules with Arazzo in their targetSpecs are tested in `test/arazzo/lint/JSONSchema/JSONSchema.ts`. Each test validates both a valid and invalid YAML fixture.

63 out of 64 Arazzo-applicable JSON Schema rules have passing tests. The SCHEMA_PATTERNPROPERTIES_KEY rule is documented as untestable in the Arazzo context due to parser limitations with key-level element iteration within nested schema objects.
