# Step Object - Phase 3 Audit

## Specification Analysis

The Step Object (Section 4.6.4) defines 11 fields. The key complex constraint is the mutual exclusivity of `operationId`, `operationPath`, and `workflowId`.

## Existing Rules (Phase 2)

16 rules covering all fields including required checks, type validation, pattern matching, output key/value validation, and allowed fields.

## Missing Rules Found

- `operation-id--mutually-exclusive` (9071000): operationId is mutually exclusive with operationPath and workflowId
- `operation-path--mutually-exclusive` (9071001): operationPath is mutually exclusive with operationId and workflowId
- `workflow-id--mutually-exclusive` (9071002): workflowId is mutually exclusive with operationId and operationPath

## Implementation

All three rules use the `conditions` mechanism with `missingField` (negated) to check the field exists, then `missingFields` to verify conflicting fields are absent.

## Test Coverage

Test added for `ARAZZO_STEP_FIELD_OPERATION_ID_MUTUALLY_EXCLUSIVE` with valid/invalid fixtures. The invalid fixture has both `operationId` and `operationPath` present simultaneously. Test passes.

## Total Rules After Phase 3: 19
