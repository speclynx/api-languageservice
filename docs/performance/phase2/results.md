# Phase 2: Validation Engine Performance Optimization Results

## Summary

Phase 2 identified and fixed the dominant performance bottleneck for large documents: the `apilintPropertyUniqueValue` lint function, which performed a full API tree traversal (O(n)) on every call, resulting in O(n^2) behavior. Replacing it with a lazily-built, cached index reduced total validation time on the Zoom Contact Center spec from ~30 seconds to ~2 seconds, a 93% reduction (15x speedup).

## Benchmark Results

Tested on the Zoom Contact Center OpenAPI spec (83,726 ApiDOM elements, 225 operations, 320,816 rule evaluations):

| Metric | Phase 1 (before) | Phase 2 (after) | Improvement |
|--------|-------------------|-----------------|-------------|
| Total validation time | 30,187ms | 1,978ms | 93.4% (15.3x) |
| forEach traversal | 29,128ms | 731ms | 97.5% (39.8x) |
| apilintPropertyUniqueValue | 26,818ms | 125ms | 99.5% (214x) |
| Lint functions total | 28,531ms | 232ms | 99.2% |

### Time Breakdown After Optimization

```
findNamespace:            189ms  (9.6%)
first parse/cache:        917ms  (46.3%)
annotations processing:   134ms  (6.8%)
forEach traversal:        731ms  (36.9%)
  getLintRules:            20ms
  conditions:              65ms
  lint functions:         232ms
    apilintPropertyUniqueValue:  125ms  (down from 26,818ms)
    missingField:                 34ms
    apilintNoDuplicateKeys:       13ms
    apilintOpenAPIParameterInPathTemplate: 13ms
    all others:                   47ms
  source maps:             10ms
reference validation:       0ms
jsonpath rules:             0ms
validation providers:       0ms
TOTAL:                  1,978ms
```

After the fix, time is well-distributed. The largest single cost is now document parsing/caching at 917ms (46%), followed by the forEach traversal at 731ms (37%), and findNamespace at 189ms (10%). There is no longer a single dominant bottleneck.

## Changes Made

### 1. Uniqueness index for `apilintPropertyUniqueValue` (Critical Impact)

Files changed: `linter-functions.ts`

The function previously called `filter(api, predicate)` on every invocation, traversing the entire API tree to find all elements matching the specified type/class with a given key value. For 225 operations in a large spec with 83,726 elements, this meant 225 * 83,726 = ~18.8 million element visits.

The replacement uses a `WeakMap<Element, Map<string, Map<unknown, number>>>` to lazily build and cache a per-API-root uniqueness index. On the first call for a given `(elementOrClasses, key)` combination, a single `forEach` traversal builds a `Map<value, count>` recording how many matching elements have each value. Subsequent calls for the same parameters return the cached map and perform an O(1) lookup. The WeakMap ensures automatic cleanup when the API tree is garbage-collected.

### 2. Performance instrumentation (Diagnostic)

Files changed: `validation-service.ts`, `test/validate-big.ts`

Comprehensive `debug()` timing was added to every significant phase of `doValidation`, including a per-lint-function timing aggregation that logs function name, total time, call count, and per-call average in descending order of total time. This instrumentation is gated behind `LogLevel.DEBUG` and has negligible overhead in production (the `debug()` function returns immediately when log level is above DEBUG).

## Test Results

All 139 existing tests pass with no regressions. Lint passes (0 errors, only pre-existing `no-explicit-any` warnings). TypeScript type checking passes.
