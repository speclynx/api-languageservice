# Phase 1: Validation Engine Performance Optimization Plan

## Analysis Summary

After analyzing the validation engine (`validation-service.ts`), linter functions (`linter-functions.ts`), and condition checking (`utils.ts:checkConditions`), the following performance bottlenecks were identified.

### Bottleneck 1: Linear scan for linter function lookup (High Impact)

In both `processRule()` (line 934) and `checkConditions()` (line 300), the linter function is resolved by calling `standardLinterfunctions.find()` which performs an O(n) linear scan through the entire array of ~40 functions. This lookup happens for every rule on every element, and again for every condition. With hundreds of rules and hundreds of elements in a typical document, this adds up to tens of thousands of unnecessary array iterations.

The fix is to convert `standardLinterfunctions` lookups to use a `Map<string, Function>` for O(1) access.

### Bottleneck 2: Repeated rule filtering per element per class (High Impact)

The `getLintingRulesSemantic()` method is called for each class/symbol on each element. It re-reads and re-filters the same metadata arrays every time. For a document with 200 elements where each element has 2-3 classes, this means 400-600 calls that re-filter the same rule arrays, each time checking `matchesCategory`, `given`, and `givenFormat` for every rule.

The fix is to cache the filtered results by symbol, since the namespace, validation flags, and rules don't change during a single validation run.

### Bottleneck 3: Per-rule targetSpecs matching (Medium Impact)

In `processRule()`, every rule checks its `targetSpecs` array against the document's namespace and version. Since the document's namespace and version are constant for the entire validation run, this check is redundant for rules that have already been evaluated (and will evaluate identically for every element). Rules should be pre-filtered by targetSpecs once at the start of validation or at least cached per-symbol.

This will be addressed as part of the rule caching in Bottleneck 2: the cached rules will only include rules that match the current spec.

### Bottleneck 4: Repeated RegExp construction (Medium Impact)

Several linter functions create new `RegExp` objects on every invocation, even when called repeatedly with the same pattern string. The `casing()` function, `apilintValueRegex`, `apilintKeyRegex`, `apilintFieldValueRegex`, `apilintKeysRegex`, and `apilintMembersKeysRegex` all construct regexes from string parameters. A regex cache would eliminate this redundant work.

### Bottleneck 5: `findElements().length > 0` for boolean checks (Low-Medium Impact)

Functions like `allowedFields`, `apilintArrayOfElementsOrClasses`, `apilintChildrenOfElementsOrClasses`, `apilintArrayOfType`, and `apilintChildrenOfType` call `element.findElements(predicate)` which collects all matching elements into an array, then check `.length > 0`. For a boolean "any match?" check, this is wasteful since it continues scanning after the first match. Using `someElements()` or equivalent early-exit pattern would be more efficient.

### Bottleneck 6: Set creation from classes on every element (Low Impact)

Line 768 creates `Array.from(new Set(element.classes as string[]))` for deduplication on every element traversal. Classes are typically already unique; this can be simplified.

## Implementation Plan

The changes are ordered from highest to lowest impact.

### Change 1: Linter function lookup Map

Convert the linear `find()` lookup to a pre-built `Map`. This requires changes in `linter-functions.ts` (export a Map alongside the array), `validation-service.ts` (use Map in `processRule`), and `utils.ts` (use Map in `checkConditions`).

### Change 2: Rule caching with targetSpecs pre-filtering

Cache `getLintingRulesSemantic` results per symbol within a single validation run. Pre-filter rules by targetSpecs during caching, eliminating redundant spec matching in `processRule`. This requires changes in `validation-service.ts`.

### Change 3: Regex caching

Add a module-level regex cache (simple `Map<string, RegExp>`) used by all regex-creating functions. This requires changes in `linter-functions.ts`.

### Change 4: Early-exit for boolean element checks

Replace `findElements(pred).length > 0` with `someElements(pred)` or similar early-exit pattern. This requires checking what the ApiDOM `findElements` API supports, and if no `some`-style method exists, implementing the check inline.

### Change 5: Simplify class deduplication

Remove unnecessary Set creation if classes are already unique, or use a more efficient deduplication approach.

### Change 6: Lazy source map computation

Defer `getSourceMap(element)` from per-element to only when a rule actually fails and a diagnostic needs to be produced, since most rules pass.

## Future Opportunities (not addressed in Phase 1)

The following were identified during analysis but deferred because they either require deeper architectural changes or have limited impact given the rule configurations currently in use.

### Full-tree traversals in relational linter functions

Functions `apilintPropertyUniqueValue`, `apilintElementKeysIncluded`, `apicompleteSecurity`, and `apicompleteChannelServers` use `filter(api, predicate)` which traverses the entire API tree. When these functions are invoked per-element (e.g., checking operationId uniqueness), this creates O(n^2) behavior. A possible optimization would be to pre-build indexes (element-type-to-elements maps) at the start of validation and pass them to these functions, reducing each call from O(n) to O(1). The impact depends on how frequently these rules are triggered in practice.

### Condition evaluation caching

The `checkConditions` function evaluates conditions for each rule on each element. If the same condition (same function + same params) is checked for the same element across multiple rules, results could be cached. However, this would require building a composite cache key which may negate the savings for simple conditions.

### Structural pre-classification of elements

Currently, each element's type/class set is inspected during traversal to find matching rules. An alternative approach would be to pre-classify elements by type during a single traversal pass, then iterate rules per-type rather than per-element. This would change the iteration order from "for each element, for each symbol, find rules" to "for each rule, find matching elements", which could be more efficient when many elements share the same type but few rules match.
