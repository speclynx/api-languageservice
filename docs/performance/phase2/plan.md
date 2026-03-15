# Phase 2: Validation Engine Performance Optimization Plan

## Motivation

Phase 1 optimizations (function lookup Maps, rule caching, regex caching, early-exit loops) produced a measured 40-56% improvement on small-to-medium documents (petstore at ~110ms). However, when tested against a large real-world spec (the Zoom Contact Center OpenAPI spec at ~83,726 elements), the improvement was negligible: both the optimized branch and main took 29-32 seconds. The phase 1 micro-optimizations saved microseconds per operation, but the total time was dominated by a different bottleneck entirely.

## Investigation

Comprehensive `debug()` instrumentation with `performance.now()` timestamps was added to every significant phase of `doValidation`, including per-function timing breakdowns. The instrumentation covers: `findNamespace`, document parsing/caching, annotation processing, the `forEach` traversal loop, per-rule evaluation, `checkConditions`, each lint function call (aggregated by function name), source map computation, reference validation, JSONPath rules, and validation providers.

### Profiling Results (Before Phase 2 Fix)

On the Zoom Contact Center spec (83,726 elements, 320,816 rule evaluations):

```
findNamespace:            153ms  (0.5%)
first parse/cache:        771ms  (2.6%)
annotations processing:   132ms  (0.4%)
forEach traversal:     29,128ms (96.5%)
  getLintRules:            21ms  (cached, negligible)
  conditions:              77ms
  lint functions:      28,531ms (94.5% of total!)
  source maps:             11ms
reference validation:       0ms
jsonpath rules:             0ms
validation providers:       0ms
TOTAL:                 30,187ms
```

The per-function breakdown revealed the single bottleneck:

```
apilintPropertyUniqueValue:  26,818ms  (225 calls, 119ms/call)  -- 93% OF TOTAL TIME
missingField:                    39ms  (40,382 calls)
apilintNoDuplicateKeys:          15ms  (83,726 calls)
all other functions:             <50ms  combined
```

### Root Cause

`apilintPropertyUniqueValue` is called once per `operation` element to verify that `operationId` values are unique across the document. Each call invokes `filter(api, predicate)`, which traverses the entire API tree (83,726 elements) looking for matching elements. With 225 operations in the spec, this creates 225 full tree traversals totaling approximately 18.8 million element visits. This is the O(n^2) problem identified in the Phase 1 plan under "Future Opportunities: Full-tree traversals in relational linter functions."

The phase 1 micro-optimizations (Map lookups, regex caching) were saving microseconds per call on operations that themselves cost only 0.2-1.0us each. Meanwhile, a single `apilintPropertyUniqueValue` call cost 119,000us (119ms). The phase 1 changes were correct but addressed less than 1% of the actual time budget for large documents.

## Optimization: Pre-built Uniqueness Index

The fix replaces the per-call full-tree traversal with a lazily-built, cached index. On the first call to `apilintPropertyUniqueValue` for a given API root and parameter combination, a single tree traversal builds a `Map<value, count>` that counts how many elements of the requested type have each value for the specified key. Subsequent calls for the same parameters perform an O(1) lookup into this map.

The index is cached in a `WeakMap<Element, Map<string, Map<unknown, number>>>` keyed by the API root element. This ensures the index is automatically garbage-collected when the API tree is released, and that different validation runs on different documents don't interfere. The composite key for the inner map encodes `elementOrClasses.join(',') + '|' + key` to distinguish different parameter combinations.

### Files Changed

`packages/apidom-ls/src/services/validation/linter-functions.ts`: Added `uniquenessIndexCache` WeakMap, `getUniquenessIndex` helper, replaced the `apilintPropertyUniqueValue` implementation to use the index.

### Instrumentation Added

`packages/apidom-ls/src/services/validation/validation-service.ts`: Added comprehensive `debug()` timing calls throughout `doValidation` and `processRule`, including per-function timing aggregation. Added `funcTimings` Map that tracks call count and total time per lint function name, logged in descending order of total time after the forEach traversal.

`packages/apidom-ls/test/validate-big.ts`: Updated to use `LogLevel.DEBUG` and `performanceLogs: true` for profiling.

## Future Opportunities

The profiling data shows that after the uniqueness index fix, the remaining time budget is well-distributed across many small functions with no single dominant bottleneck. The `forEach` traversal itself (visiting 83,726 elements) takes approximately 200ms of overhead beyond the lint function calls. Potential further optimizations include pre-indexing for `apilintElementKeysIncluded` (used by AsyncAPI rules) which has the same O(n^2) pattern, and reducing the 320,816 rule evaluations by batching rules by element type.
