# Phase 2 Audit: Arazzo Rules vs Specification

This document records the systematic audit of all implemented Arazzo linting rules against the Arazzo 1.0.1 specification.

## Audit Summary

### Issues Found

#### Missing Rules

1. workflow/outputs--values-type: Output values must be strings (Runtime Expressions). The spec says outputs is `Map[string, expression]` where values are Runtime Expressions (strings).
2. step/outputs--values-type: Same as above for step-level outputs.
3. components/inputs--keys-pattern: Component map keys must match `^[a-zA-Z0-9\.\-_]+$` per the spec.
4. components/parameters--keys-pattern: Same pattern for parameters keys.
5. components/success-actions--keys-pattern: Same pattern for successActions keys.
6. components/failure-actions--keys-pattern: Same pattern for failureActions keys.

#### Naming Issues

7. info/allowed-fields-2-0--3-0.ts: The filename references "2-0--3-0" which is an OpenAPI version convention. Should be renamed to `allowed-fields.ts` for consistency with all other elements.

#### Dead Code (removed from index but files still on disk)

8. JSONSchema/allowed-fields-openapi-2-0.ts: Removed from index.ts in Phase 1 but file still on disk.
9. JSONSchema/allowed-fields-openapi-3-0.ts: Same.
10. JSONSchema/$ref--no-siblings.ts: Same.
11. JSONSchema/discriminator--exist-in-required.ts: Same.
12. JSONSchema/nullable--type.ts: Same.
13. JSONSchema/nullable--not-recommended.ts: Same.
14. JSONSchema/xml--type.ts: Same.
15. JSONSchema/external-docs--type.ts: Same.

#### Missing Tests (elements with rules but NO test coverage)

16. arazzoSpecification1: 13 rules, 0 dedicated tests.
17. components: 9 rules, 0 tests.
18. criterion: 5 rules, 0 tests.
19. criterionExpressionType: 6 rules, 0 tests.
20. requestBody: 3 rules, 0 tests.
21. payloadReplacement: 4 rules, 0 tests.
22. reusable: 4 rules, 0 tests.

### Per-Element Audit

#### Arazzo Specification Object (arazzoSpecification1)

| Field | Spec | Rule | Status |
|-------|------|------|--------|
| arazzo | required, string, pattern | arazzo--required, arazzo--type, arazzo--pattern | OK |
| info | required, Info Object | info--required, info--type | OK |
| sourceDescriptions | required, array of SourceDescription, min 1 | source-descriptions--required, source-descriptions--type, source-descriptions--non-empty | OK |
| workflows | required, array of Workflow, min 1 | workflows--required, workflows--type, workflows--non-empty | OK |
| components | optional, Components Object | components--type | OK |
| allowed fields | arazzo, info, sourceDescriptions, workflows, components + x- | allowed-fields | OK |
| Tests | None | MISSING | Needs tests |

#### Info Object (info)

| Field | Spec | Rule | Status |
|-------|------|------|--------|
| title | required, string | title--required, title--type | OK |
| summary | optional, string | summary--type | OK |
| description | optional, string | description--type | OK |
| version | required, string | version--required, version--type | OK |
| allowed fields | title, summary, description, version + x- | allowed-fields-2-0--3-0 | Rename needed |
| Tests | 5 tests covering title, version, summary | OK (good coverage) |

#### Source Description Object (sourceDescription)

| Field | Spec | Rule | Status |
|-------|------|------|--------|
| name | required, string, pattern [A-Za-z0-9_\-]+ | name--required, name--type, name--pattern | OK |
| url | required, string (URI-reference) | url--required, url--type | OK |
| type | optional, string, openapi|arazzo | type--type, type--equals | OK |
| allowed fields | name, url, type + x- | allowed-fields | OK |
| Tests | 3 tests | OK |

#### Workflow Object (workflow)

| Field | Spec | Rule | Status |
|-------|------|------|--------|
| workflowId | required, string, pattern | workflow-id--required, workflow-id--type, workflow-id--pattern | OK |
| summary | optional, string | summary--type | OK |
| description | optional, string | description--type | OK |
| inputs | optional, JSON Schema | inputs--type | OK |
| dependsOn | optional, array of strings | depends-on--type | OK |
| steps | required, array of Step, min 1 | steps--required, steps--type, steps--non-empty | OK |
| successActions | optional, array of SuccessAction|Reusable | success-actions--type | OK |
| failureActions | optional, array of FailureAction|Reusable | failure-actions--type | OK |
| outputs | optional, map, keys pattern, values Runtime Expression | outputs--type, outputs--keys-pattern | MISSING values-type |
| parameters | optional, array of Parameter|Reusable | parameters--type | OK |
| allowed fields | all fields + x- | allowed-fields | OK |
| Tests | 3 tests | Needs more |

#### Step Object (step)

| Field | Spec | Rule | Status |
|-------|------|------|--------|
| stepId | required, string, pattern | step-id--required, step-id--type, step-id--pattern | OK |
| description | optional, string | description--type | OK |
| operationId | optional, string | operation-id--type | OK |
| operationPath | optional, string | operation-path--type | OK |
| workflowId | optional, string | workflow-id--type | OK |
| parameters | optional, array of Parameter|Reusable | parameters--type | OK |
| requestBody | optional, RequestBody Object | request-body--type | OK |
| successCriteria | optional, array of Criterion | success-criteria--type | OK |
| onSuccess | optional, array of SuccessAction|Reusable | on-success--type | OK |
| onFailure | optional, array of FailureAction|Reusable | on-failure--type | OK |
| outputs | optional, map, keys pattern, values Runtime Expression | outputs--type, outputs--keys-pattern | MISSING values-type |
| allowed fields | all fields + x- | allowed-fields | OK |
| Tests | 2 tests | Needs more |

#### Parameter Object (parameter)

| Field | Spec | Rule | Status |
|-------|------|------|--------|
| name | required, string | name--required, name--type | OK |
| in | optional, string, enum | in--type, in--equals | OK |
| value | required, any | value--required | OK |
| allowed fields | name, in, value + x- | allowed-fields | OK |
| Tests | 2 tests | OK |

#### Success Action Object (successAction)

All fields covered. Tests: 2. OK.

#### Failure Action Object (failureAction)

All fields covered. Tests: 2. OK.

#### Components Object (components)

| Field | Spec | Rule | Status |
|-------|------|------|--------|
| inputs | optional, map, values JSONSchema | inputs--type, inputs--values-type | MISSING keys-pattern |
| parameters | optional, map, values Parameter | parameters--type, parameters--values-type | MISSING keys-pattern |
| successActions | optional, map, values SuccessAction | success-actions--type, success-actions--values-type | MISSING keys-pattern |
| failureActions | optional, map, values FailureAction | failure-actions--type, failure-actions--values-type | MISSING keys-pattern |
| allowed fields | inputs, parameters, successActions, failureActions + x- | allowed-fields | OK |
| Tests | None | MISSING |

#### Criterion Object (criterion)

All fields covered. Tests: 0. MISSING.

#### Criterion Expression Type Object (criterionExpressionType)

All fields covered. Tests: 0. MISSING.

#### Request Body Object (requestBody)

All fields covered. Tests: 0. MISSING.

#### Payload Replacement Object (payloadReplacement)

All fields covered. Tests: 0. MISSING.

#### Reusable Object (reusable)

All fields covered. Tests: 0. MISSING.

## Fix Plan

- [x] Batch 1: Add missing rules (outputs--values-type for workflow/step, keys-pattern for components)
- [x] Batch 2: Rename info/allowed-fields, delete dead JSONSchema files
- [x] Batch 3: Add tests for arazzoSpecification1, components, criterion
- [x] Batch 4: Add tests for criterionExpressionType, requestBody, payloadReplacement, reusable
- [ ] Batch 5: Final verification and documentation update

### Notes on Untestable Rules

Some rules cannot be tested in isolation due to ApiDOM parser behavior:

The `arazzo--required` and `arazzo--pattern` rules on the arazzoSpecification1 element are untestable because the `arazzo` field value is what the parser uses to identify the document as an Arazzo spec. Without it (or with a non-matching version), the parser doesn't create arazzo elements, so rules never fire.

The `criterionExpressionType` rules for `type--required` and `type--equals` are similarly untestable because the parser relies on the `type` field's value to identify the element as a CriterionExpressionType. Invalid values cause the parser to not create the element at all.

The `reusable` `reference--required` rule is untestable because the `reference` field is what the parser uses to distinguish Reusable Objects from Parameter Objects. Without it, the parser creates a Parameter instead.

These rules are structurally correct and provide value in the metadata. They would fire in contexts where the parser creates these elements through different pathways (e.g., custom configurations).
