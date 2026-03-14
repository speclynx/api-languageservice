## Addressing performance issues related to validation rule engine and used functions


### Goal

The final goal of this task is to improve the performance of the validation engine and the related functions and rules.

### Procedure

You will document all your work, including the plan, the decisions you made, and the results in markdown files in the `docs/performance/phase1` folder.

You will perform this task in the following steps:

- Understand the rules engine mechanism, the functions, and the format of the rules. Read `docs/rules-engine.md` for an overview.
- Analyze current performance bottlenecks and identify areas for optimization.
- Refactor code to reduce unnecessary parsing and traversals and improve function efficiency.(mainly passed document traversal, but possibly also ruleset traversal)
- Implement caching mechanisms to store and reuse validation results, only if necessary and feasible.
- Optimize rule loading and execution to minimize overhead.
- Profile and benchmark the system to measure performance improvements.

The main areas of improvement are probably the duplicated traversals in the "validation engine" and within the functions themselves along with lack of caching.

### Tech notes

* under the hood this makes use of ApiDOM project, providing the `element` and `meta.classes` properties of the node used by the rules engine

### Links and pointers

* validation service: `packages/apidom-ls/src/services/validation/validation-service.ts`
* functions: `packages/apidom-ls/src/services/validation/linter-functions.ts`
* implemented rules: `packages/apidom-ls/src/config`
* Openapi rules root path: `packages/apidom-ls/src/config/openapi`
* Asyncapi rules root path: `packages/apidom-ls/src/config/asyncapi`
* Rules engine docs markdown file: `docs/rules-engine.md`

* ApiDOM project: `/dati/dev/progetti/speclynx/projects/apidom-speclynx/apidom` (https://github.com/speclynx/apidom)

