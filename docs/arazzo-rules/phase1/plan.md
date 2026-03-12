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
- [ ] Implement missing rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 2: Arazzo Specification Object (root)

Target element: `arazzoSpecification1`

Rules needed:
- `arazzo--required` (arazzo version field required)
- `arazzo--type` (arazzo version field must be string)
- `arazzo--pattern` (arazzo version must match `^1\.0\.\d+(-.+)?$`)
- `info--required` (info field required)
- `info--type` (info field must be object)
- `source-descriptions--required` (sourceDescriptions required)
- `source-descriptions--type` (sourceDescriptions must be array of sourceDescription elements)
- `source-descriptions--non-empty` (sourceDescriptions must have at least one entry)
- `workflows--required` (workflows required)
- `workflows--type` (workflows must be array of workflow elements)
- `workflows--non-empty` (workflows must have at least one entry)
- `components--type` (components must be object if present)
- `allowed-fields` (only allowed fields + extensions)

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 3: Source Description Object

Target element: `sourceDescription`

Rules needed:
- `name--required`
- `name--type` (string)
- `name--pattern` (`^[A-Za-z0-9_\-]+$`)
- `url--required`
- `url--type` (string)
- `type--type` (string)
- `type--equals` (enum: openapi, arazzo)
- `allowed-fields`

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 4: Workflow Object

Target element: `workflow`

Rules needed:
- `workflow-id--required`
- `workflow-id--type` (string)
- `workflow-id--pattern` (`^[A-Za-z0-9_\-]+$`)
- `summary--type` (string)
- `description--type` (string)
- `inputs--type` (object / JSONSchema element)
- `steps--required`
- `steps--type` (array of step elements)
- `steps--non-empty` (at least one entry)
- `depends-on--type` (array of strings)
- `success-actions--type` (array of successAction or reusable elements)
- `failure-actions--type` (array of failureAction or reusable elements)
- `outputs--type` (object)
- `outputs--keys-pattern` (keys match `^[a-zA-Z0-9\.\-_]+$`)
- `parameters--type` (array of parameter or reusable elements)
- `allowed-fields`

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 5: Step Object

Target element: `step`

Rules needed:
- `step-id--required`
- `step-id--type` (string)
- `step-id--pattern` (`^[A-Za-z0-9_\-]+$`)
- `description--type` (string)
- `operation-id--type` (string)
- `operation-path--type` (string)
- `workflow-id--type` (string)
- `request-body--type` (object / requestBody element)
- `success-criteria--type` (array of criterion elements)
- `on-success--type` (array of successAction or reusable elements)
- `on-failure--type` (array of failureAction or reusable elements)
- `outputs--type` (object)
- `outputs--keys-pattern` (keys match `^[a-zA-Z0-9\.\-_]+$`)
- `parameters--type` (array of parameter or reusable elements)
- `allowed-fields`

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 6: Parameter Object

Target element: `parameter`

Rules needed:
- `name--required`
- `name--type` (string)
- `in--type` (string)
- `in--equals` (enum: path, query, header, cookie, body)
- `value--required`
- `allowed-fields`

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 7: Success Action Object

Target element: `successAction`

Rules needed:
- `name--required`
- `name--type` (string)
- `type--required`
- `type--type` (string)
- `type--equals` (enum: end, goto)
- `workflow-id--type` (string)
- `step-id--type` (string)
- `criteria--type` (array of criterion elements)
- `allowed-fields`

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 8: Failure Action Object

Target element: `failureAction`

Rules needed:
- `name--required`
- `name--type` (string)
- `type--required`
- `type--type` (string)
- `type--equals` (enum: end, goto, retry)
- `workflow-id--type` (string)
- `step-id--type` (string)
- `retry-after--type` (number)
- `retry-after--non-negative` (>= 0)
- `retry-limit--type` (number/integer)
- `retry-limit--non-negative` (>= 0, integer)
- `criteria--type` (array of criterion elements)
- `allowed-fields`

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 9: Components Object

Target element: `components`

Rules needed:
- `inputs--type` (object)
- `inputs--values-type` (values must be JSONSchema elements)
- `parameters--type` (object)
- `parameters--values-type` (values must be parameter elements)
- `success-actions--type` (object)
- `success-actions--values-type` (values must be successAction elements)
- `failure-actions--type` (object)
- `failure-actions--values-type` (values must be failureAction elements)
- `allowed-fields`

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 10: Criterion Object

Target element: `criterion`

Rules needed:
- `condition--required`
- `condition--type` (string)
- `context--type` (string)
- `type--type` (string or criterionExpressionType element)
- `type--equals` (enum when string: simple, regex, jsonpath, xpath)
- `allowed-fields`

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 11: Criterion Expression Type Object

Target element: `criterionExpressionType`

Rules needed:
- `type--required`
- `type--type` (string)
- `type--equals` (enum: jsonpath, xpath)
- `version--required`
- `version--type` (string)
- `allowed-fields`

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 12: Request Body Object

Target element: `requestBody`

Rules needed:
- `content-type--type` (string)
- `replacements--type` (array of payloadReplacement elements)
- `allowed-fields`

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 13: Payload Replacement Object

Target element: `payloadReplacement`

Rules needed:
- `target--required`
- `target--type` (string)
- `value--required`
- `allowed-fields`

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 14: Reusable Object

Target element: `reusable`

Rules needed:
- `reference--required`
- `reference--type` (string)
- `value--type` (string)
- `allowed-fields` (NO extensions allowed for this object)

- [ ] Identify rules
- [ ] Implement rules
- [ ] Add tests and fixtures
- [ ] Document rules

### Batch 15: JSON Schema Rules (review and fix)

Target element: `JSONSchema`

The JSON Schema rules are already implemented. This batch reviews them for correctness, adds any missing rules, fixes issues (especially around `discriminator`), and ensures test coverage.

- [ ] Review existing rules
- [ ] Fix any issues found
- [ ] Add missing tests and fixtures
- [ ] Document rules

### Batch 16: Final Integration and Documentation

- [ ] Verify all rules work together with a comprehensive fixture
- [ ] Create rules-docs.md documentation
- [ ] Final test pass
