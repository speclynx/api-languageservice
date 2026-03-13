# Criterion Object - Phase 3 Audit

## Specification Analysis

The Criterion Object (Section 4.6.12) defines 3 fields. The key complex constraint is that when `type` is specified, `context` MUST be provided.

## Existing Rules (Phase 2)

5 rules covering all fields.

## Missing Rules Found

- `context--required-when-type` (9120400): context MUST be provided when type is specified

## Implementation

The rule uses `hasRequiredField('context')` as the linter function, with a condition checking that `type` exists using `missingField('type')` negated.

## Test Coverage

Test added with valid/invalid fixtures. The invalid fixture has `type: jsonpath` without a `context` field. The valid fixture has both `type` and `context`. Test passes.

## Total Rules After Phase 3: 6
