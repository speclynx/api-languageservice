# Phase 1: Arazzo Specification Linting Rules - Implementation Plan

This plan covers transforming the Arazzo 1.0.1 specification and JSON Schema into ApiDOM linting rules. The focus is on structural validation: required fields, type checks, allowed fields, enum values, format constraints, and array constraints. Semantic validation (e.g. operationId resolution, expression validation) is deferred to later phases.

## Approach

Rules are organized by target element matching the existing `packages/apidom-ls/src/config/arazzo/` structure. Each target element gets its own directory with individual rule files, a `lint/index.ts`, and a `meta.ts`. The arazzo `config.ts` aggregates all element metas.

For each target element, we implement the following categories of rules where applicable:

- Required field checks (`hasRequiredField`)
- Field type checks (`apilintType` for string, number, boolean, object, array)
- Allowed fields checks (`allowedFields`)
- Enum value checks (`apilintValueOrArray`)
- Format checks (URI, regex patterns via `apilintValueRegex`)
- Array constraints (`apilintArrayOfElementsOrClasses`, non-empty arrays)
- Number constraints (`apilintNumber`)

Error codes follow the `9XXYYZZ` pattern where `XX` identifies the object category.

## Batches

### Batch 1: Info Object (complete existing rules + add missing)

Target element: `info`

Existing rules: `title--required`, `description--type`, `allowed-fields`
Missing rules: `version--required`, `version--type`, `summary--type`, `title--type`

- [x] Identify rules
- [x] Implement missing rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 2: Arazzo Specification Object (root)

Target element: `arazzoSpecification1`

Rules: `arazzo--required`, `arazzo--type`, `arazzo--pattern`, `info--required`, `info--type`, `source-descriptions--required`, `source-descriptions--type`, `source-descriptions--non-empty`, `workflows--required`, `workflows--type`, `workflows--non-empty`, `components--type`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 3: Source Description Object

Target element: `sourceDescription`

Rules: `name--required`, `name--type`, `name--pattern`, `url--required`, `url--type`, `type--type`, `type--equals`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 4: Workflow Object

Target element: `workflow`

Rules: `workflow-id--required`, `workflow-id--type`, `workflow-id--pattern`, `summary--type`, `description--type`, `inputs--type`, `steps--required`, `steps--type`, `steps--non-empty`, `depends-on--type`, `success-actions--type`, `failure-actions--type`, `outputs--type`, `outputs--keys-pattern`, `parameters--type`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 5: Step Object

Target element: `step`

Rules: `step-id--required`, `step-id--type`, `step-id--pattern`, `description--type`, `operation-id--type`, `operation-path--type`, `workflow-id--type`, `request-body--type`, `success-criteria--type`, `on-success--type`, `on-failure--type`, `outputs--type`, `outputs--keys-pattern`, `parameters--type`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 6: Parameter Object

Target element: `parameter`

Rules: `name--required`, `name--type`, `in--type`, `in--equals`, `value--required`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 7: Success Action Object

Target element: `successAction`

Rules: `name--required`, `name--type`, `type--required`, `type--type`, `type--equals`, `workflow-id--type`, `step-id--type`, `criteria--type`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 8: Failure Action Object

Target element: `failureAction`

Rules: `name--required`, `name--type`, `type--required`, `type--type`, `type--equals`, `workflow-id--type`, `step-id--type`, `retry-after--type`, `retry-after--non-negative`, `retry-limit--type`, `retry-limit--non-negative`, `criteria--type`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 9: Components Object

Target element: `components`

Rules: `inputs--type`, `inputs--values-type`, `parameters--type`, `parameters--values-type`, `success-actions--type`, `success-actions--values-type`, `failure-actions--type`, `failure-actions--values-type`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 10: Criterion Object

Target element: `criterion`

Rules: `condition--required`, `condition--type`, `context--type`, `type--equals`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 11: Criterion Expression Type Object

Target element: `criterionExpressionType`

Rules: `type--required`, `type--type`, `type--equals`, `version--required`, `version--type`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 12: Request Body Object

Target element: `requestBody`

Rules: `content-type--type`, `replacements--type`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 13: Payload Replacement Object

Target element: `payloadReplacement`

Rules: `target--required`, `target--type`, `value--required`, `allowed-fields`

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 14: Reusable Object

Target element: `reusable`

Rules: `reference--required`, `reference--type`, `value--type`, `allowed-fields` (NO extensions)

- [x] Identify rules
- [x] Implement rules
- [x] Add tests and fixtures
- [x] Document rules

### Batch 15: JSON Schema Rules (review and fix)

Target element: `JSONSchema`

The JSON Schema rules are already implemented. This batch reviews them for correctness, adds any missing rules, fixes issues (especially around `discriminator`), and ensures test coverage.

- [x] Review existing rules
- [x] Fix any issues found
- [x] Add missing tests and fixtures
- [x] Document rules

### Batch 16: Final Integration and Documentation

- [x] Verify all rules work together with a comprehensive fixture
- [x] Create rules-docs.md documentation
- [x] Final test pass
