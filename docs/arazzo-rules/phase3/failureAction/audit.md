# Failure Action Object - Phase 3 Audit

## Specification Analysis

The Failure Action Object (Section 4.6.8) defines 8 fields. The key complex constraints are the mutual exclusivity of `workflowId` and `stepId`, and the fact that `retryAfter` and `retryLimit` only apply when `type` is `"retry"`.

## Existing Rules (Phase 2)

13 rules covering all fields.

## Missing Rules Found

- `workflow-id--mutually-exclusive` (9100800): workflowId is mutually exclusive with stepId
- `step-id--mutually-exclusive` (9100801): stepId is mutually exclusive with workflowId
- `retry-after--only-retry` (9100900): retryAfter only applies when type is "retry" (warning)
- `retry-limit--only-retry` (9100901): retryLimit only applies when type is "retry" (warning)

## Implementation

Mutual exclusivity rules follow the same pattern as Success Action. The retry-only rules use `apilintValueOrArray` to check the `type` field value, conditioned on the retry field being present.

## Test Coverage

Tests added for mutual exclusivity and retry-after-only-retry with valid/invalid fixtures. Both tests pass.

## Total Rules After Phase 3: 17
