# Phase 5: Spectral Arazzo Rules Import Plan

This document details the plan for importing and transforming Spectral Arazzo linting rules into ApiDOM linting rules. Phase 5 focuses on cross-referencing, semantic validation, and best-practice rules that go beyond the structural validation implemented in phases 1-4.

## Gap Analysis

### Spectral Rules Already Covered by Phases 1-4

These Spectral rules are fully covered by existing ApiDOM structural rules and require no Phase 5 work:

- `arazzo-document-schema`: Covered by per-object structural rules (required fields, types, allowed fields, patterns)
- `arazzo-workflow-workflowId`: Covered by `workflow-id--pattern` rule
- `arazzo-step-stepId`: Covered by `step-id--pattern` rule
- `arazzo-source-descriptions-type`: Covered by `type--equals` rule on sourceDescription

### New Rules to Implement in Phase 5

The Spectral rules below represent new validation logic not yet covered. They are organized into three batches based on complexity and dependencies.

## Batch 1: Simple Best-Practice Hints/Warnings

These are simple "field should be present" or preference rules with no cross-referencing logic. They use existing linter functions (`apilintFieldTruthy`, `apilintValueRegex`, pattern matching).

- [ ] 1.1: `arazzo-info-description` — Info description should be present (warning)
- [ ] 1.2: `arazzo-info-summary` — Info summary is recommended (hint)
- [ ] 1.3: `arazzo-workflow-description` — Workflow description should be present (warning)
- [ ] 1.4: `arazzo-workflow-summary` — Workflow summary is recommended (hint)
- [ ] 1.5: `arazzo-step-description` — Step description should be present (warning)
- [ ] 1.6: `arazzo-step-operationPath` — Prefer operationId over operationPath (hint)
- [ ] 1.7: `arazzo-no-script-tags-in-markdown` — No `<script>` tags in description/title fields (error)

## Batch 2: Uniqueness Validation Rules

These rules validate uniqueness of identifiers within their scope. They require tree traversal (via the existing `getElementsByTypeOrClass` cache) or element-local iteration.

- [ ] 2.1: `arazzo-workflowId-unique` — Unique workflowId across all workflows
- [ ] 2.2: `arazzo-workflow-stepId-unique` — Unique stepId within each workflow
- [ ] 2.3: `arazzo-workflow-output-names-unique` — Unique output names per workflow
- [ ] 2.4: `arazzo-step-output-names-unique` — Unique output names per step
- [ ] 2.5: `arazzo-step-parameters-unique` — Unique parameters by name+in combination per step
- [ ] 2.6: `arazzo-step-success-actions-names-unique` — Unique success action names per step (after merging workflow+step actions)
- [ ] 2.7: `arazzo-step-failure-actions-names-unique` — Unique failure action names per step (after merging workflow+step actions)
- [ ] 2.8: `arazzo-workflow-depends-on-unique` — Unique entries in workflow dependsOn array

## Batch 3: Cross-Reference and Semantic Validation Rules

These rules validate that references resolve to existing definitions, runtime expressions are well-formed, and cross-object relationships are correct. They are the most complex rules, requiring document-level traversal and context awareness.

- [ ] 3.1: `arazzo-runtime-expression-validation` — Runtime expression syntax validation (shared function)
- [ ] 3.2: `arazzo-workflow-output-expression` — Workflow output values are valid runtime expressions
- [ ] 3.3: `arazzo-step-output-expression` — Step output values are valid runtime expressions
- [ ] 3.4: `arazzo-workflow-depends-on-resolved` — dependsOn entries resolve to existing workflows
- [ ] 3.5: `arazzo-step-validation` — Step operationId/operationPath/workflowId references resolve correctly (source description cross-refs)
- [ ] 3.6: `arazzo-step-success-criteria-validation` — Criterion context/type/condition validation (regex validity, context runtime expr)
- [ ] 3.7: `arazzo-step-request-body-validation` — Request body contentType format and runtime expression usage
- [ ] 3.8: `arazzo-step-parameters-expression` — Parameter value runtime expression validation and reusable reference resolution
- [ ] 3.9: `arazzo-step-success-actions-refs` — Success action workflowId/stepId cross-reference validation
- [ ] 3.10: `arazzo-step-failure-actions-refs` — Failure action workflowId/stepId cross-reference validation


## Implementation Approach

### Error Codes

New error codes will be added to the `ApilintCodes` enum in `packages/apidom-ls/src/config/codes.ts` following the Arazzo numbering scheme (9XXYYZZ):

- 90400XX: Root spec / document-level rules
- 90500XX: Source Description rules
- 90600XX: Workflow rules
- 90700XX: Step rules
- 90800XX: Parameter rules
- 90900XX: Success/Failure Action rules
- 91000XX: Criterion rules
- 91100XX: Request Body rules

### Linter Functions

Batch 1 rules will use existing linter functions wherever possible (`missingField` with warning severity, `apilintValueRegex` for pattern matching).

Batch 2 rules will use the existing `apilintPropertyUniqueValue` function or the `getElementsByTypeOrClass` cache mechanism for document-level uniqueness checks. New specific functions will be added to `linter-functions.ts` where needed.

Batch 3 rules will require new custom linter functions registered in the Arazzo namespace metadata, using the `getElementsByTypeOrClass` and `uniquenessIndexCache` patterns for efficient cross-referencing. A shared runtime expression validation utility will be implemented.

### Rule Definition Pattern

Each rule follows the existing pattern:
- Rule file: `packages/apidom-ls/src/config/arazzo/{element}/lint/{field}--{check}.ts`
- Registered in: `packages/apidom-ls/src/config/arazzo/{element}/lint/index.ts`
- Aggregated in: `packages/apidom-ls/src/config/arazzo/{element}/meta.ts`
- Test file: `packages/apidom-ls/test/arazzo/lint/{element}/{element}.ts`
- Fixtures: `packages/apidom-ls/test/fixtures/arazzo/{element}/`

### Testing

Each rule will have a pair of YAML fixtures (valid + invalid) and a test case that:
1. Validates the invalid fixture produces at least one diagnostic with the expected error code
2. Validates the valid fixture produces no diagnostics with that error code


## Execution Order

1. Implement Batch 1 (simple hints/warnings) — commit
2. Implement Batch 2 (uniqueness rules) — commit
3. Implement Batch 3 (cross-reference rules) — commit per sub-batch if needed
4. Final documentation update — commit
