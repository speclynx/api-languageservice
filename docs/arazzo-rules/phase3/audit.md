# Phase 3 Audit: Complex Multi-field Rules

This document records the Phase 3 analysis of complex rules inferable from the Arazzo 1.0.1 specification that were missing from the implemented rule set.

## Identified Complex Rules

### Step Object

The specification states that `operationId`, `operationPath`, and `workflowId` are mutually exclusive fields. Each field's description explicitly says "This field is mutually exclusive of the [other two] fields respectively."

Rules added:

- `operation-id--mutually-exclusive`: When `operationId` is present, `operationPath` and `workflowId` must be absent
- `operation-path--mutually-exclusive`: When `operationPath` is present, `operationId` and `workflowId` must be absent
- `workflow-id--mutually-exclusive`: When `workflowId` is present, `operationId` and `operationPath` must be absent

### Success Action Object

The specification states that `workflowId` and `stepId` are mutually exclusive: "This field is mutually exclusive to stepId" and "This field is mutually exclusive to workflowId."

Rules added:

- `workflow-id--mutually-exclusive`: When `workflowId` is present, `stepId` must be absent
- `step-id--mutually-exclusive`: When `stepId` is present, `workflowId` must be absent

### Failure Action Object

Same mutual exclusivity between `workflowId` and `stepId` as Success Action. Additionally, `retryAfter` and `retryLimit` "only apply when the type field value is retry."

Rules added:

- `workflow-id--mutually-exclusive`: When `workflowId` is present, `stepId` must be absent
- `step-id--mutually-exclusive`: When `stepId` is present, `workflowId` must be absent
- `retry-after--only-retry`: Warning when `retryAfter` is present but `type` is not `"retry"`
- `retry-limit--only-retry`: Warning when `retryLimit` is present but `type` is not `"retry"`

### Criterion Object

The specification states: "If type is specified, then the context MUST be provided."

Rule added:

- `context--required-when-type`: When `type` is present, `context` must also be present

### Parameter Object (Bug Fix)

The `in--equals` rule incorrectly allowed `"body"` as a valid value. The specification only defines `"path"`, `"query"`, `"header"`, and `"cookie"` as valid values for the `in` field. Fixed by removing `"body"` from the allowed values.

## Implementation Pattern

All mutual exclusivity and conditional field rules use the `conditions` mechanism in the rules engine. Conditions are evaluated first; if all conditions pass, the linter function executes. This pattern uses `missingField` with `negate: true` as a condition to check "field exists" and then `missingField` or `missingFields` as the linter function to check "conflicting field(s) must be absent."

For the "only applies when type is X" rules, the condition checks that the field in question exists, then the linter function checks that the `type` field has the expected value using `apilintValueOrArray`.

## Test Results

All 182 tests pass (43 Arazzo-specific tests).

## Fix Plan

- [x] Batch 1: Step mutual exclusivity rules
- [x] Batch 2: Success Action mutual exclusivity rules
- [x] Batch 3: Failure Action mutual exclusivity and retry-only rules
- [x] Batch 4: Criterion context-required-when-type rule
- [x] Batch 5: Parameter in--equals bug fix
- [ ] Batch 6: Additional targets analysis and documentation
