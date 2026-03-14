# Phase 1: Validation Engine Performance Optimization Results

## Summary

Phase 1 optimizations targeted the core validation engine hot paths. The changes produced a consistent 40-56% reduction in validation time across all tested document sizes.

## Benchmark Results

Benchmarks were run on the same machine with 20 iterations (after 3 warmup rounds) per fixture, using `doValidation` with both `semanticValidation` and `semanticLinting` enabled.

### oas-3.0-petstore.yaml (largest document, most representative)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Average | 113.99ms | 66.08ms | 42.0% |
| Median | 108.82ms | 66.82ms | 38.6% |
| Min | 102.56ms | 54.66ms | 46.7% |

### oas-3.1-basic.yaml (medium document)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Average | 3.65ms | 2.01ms | 44.9% |
| Median | 3.53ms | 2.17ms | 38.5% |
| Min | 3.39ms | 1.61ms | 52.5% |

### oas306.yaml (small document with errors)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Average | 0.16ms | 0.07ms | 56.3% |
| Median | 0.16ms | 0.07ms | 56.3% |
| Min | 0.14ms | 0.06ms | 57.1% |

## Changes Made

### 1. Linter function lookup: O(n) array scan to O(1) Map (High Impact)

Files changed: `linter-functions.ts`, `validation-service.ts`, `utils.ts`, `completion-service.ts`

The `standardLinterfunctions` array was searched linearly via `.find()` on every rule evaluation and every condition check. With ~40 functions in the array, hundreds of rules, and hundreds of elements per document, this amounted to tens of thousands of unnecessary comparisons. A `standardLinterfunctionsMap` (Map keyed by function name) was added and all call sites updated to use O(1) `.get()` lookups instead.

### 2. Rule caching with targetSpecs pre-filtering (High Impact)

Files changed: `validation-service.ts`

The `getLintingRulesSemantic()` method was called for each class/symbol on each element during tree traversal, re-filtering the same metadata arrays every time. For a document with 200 elements where each has 2-3 classes, this meant 400-600 calls re-filtering the same rule arrays.

A `rulesCache` (Map keyed by symbol name) was added to the validation run. The first call for a given symbol filters and caches the rules; subsequent calls for the same symbol return the cached result. Additionally, `targetSpecs` matching was integrated into the caching filter, so rules that don't match the current document's namespace/version are excluded once at cache time rather than being checked on every `processRule` invocation.

A new `matchesTargetSpecs` static method was extracted to consolidate the namespace/version matching logic that was previously duplicated inline.

### 3. Regex caching (Medium Impact)

Files changed: `linter-functions.ts`

Several linter functions (`apilintValueRegex`, `apilintKeyRegex`, `apilintFieldValueRegex`, `apilintKeysRegex`, `apilintMembersKeysRegex`, and `casing()`) were constructing new `RegExp` objects on every invocation, even when called with the same pattern string repeatedly. A module-level `regexCache` Map was added with a `getCachedRegex()` helper that returns cached instances for previously-seen patterns.

### 4. Early-exit for boolean element checks (Low-Medium Impact)

Files changed: `linter-functions.ts`

Eight linter functions used `element.findElements(predicate).length > 0` to check for existence, which collects all matching elements into an array before checking length. These were replaced with early-exit iteration patterns (using `for...of` over the iterable collection elements) that return immediately on the first match:

- `allowedFields`: additionally replaced `keys.includes()` with a `Set` for O(1) key lookup
- `apilintArrayOfElementsOrClasses`
- `apilintChildrenOfElementsOrClasses`
- `apilintArrayOfType`
- `apilintChildrenOfType`
- `apilintKeysIncluded` (array branch)
- `apilintElementKeysIncluded` (array branch)
- `apilintIncludedInArray`

### 5. Simplified class deduplication (Low Impact)

Files changed: `validation-service.ts`

The per-element class deduplication was changed from `Array.from(new Set(element.classes))` followed by multiple `includes()` + `unshift()` calls, to a single-pass approach using a `Set` for tracking seen values while building the symbols array. This avoids creating an intermediate Set/Array and multiple linear scans.

### 6. Lazy source map computation (Low Impact)

Files changed: `validation-service.ts`

The `getSourceMap(element)` call was previously executed for every element during tree traversal, even though source maps are only needed when a rule fails (to produce a diagnostic with a source range). Since the vast majority of rules pass, this allocated a `SourceMap` object on every element unnecessarily. The computation was moved into the `processRule` failure path, so it's only triggered when a diagnostic is actually produced.

## Test Results

All 139 existing tests pass with no regressions. Lint and TypeScript type checking also pass clean.
