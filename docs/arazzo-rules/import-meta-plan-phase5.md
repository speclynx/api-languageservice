## Import and transformation of Arazzo Spectral linting rules into APIDom linting rules

### Goal

This is the fifth phase of a process meant to implement a comprehensive set of ApiDOM linting rules for Arazzo.


The first phase was implemented according to the "meta plan" defined in `docs/arazzo-rules/import-meta-plan.md`, this has been documented in `docs/arazzo-rules/phase1/` files.
The second phase was implemented according to the "meta plan" defined in `docs/arazzo-rules/import-meta-plan-phase2.md`, this has been documented in `docs/arazzo-rules/phase2/` files.
The third phase was implemented according to the "meta plan" defined in `docs/arazzo-rules/import-meta-plan-phase3.md`, this has been documented in `docs/arazzo-rules/phase3/` files.
The fourth phase was implemented according to the "meta plan" defined in `docs/arazzo-rules/import-meta-plan-phase4.md`, this has been documented in `docs/arazzo-rules/phase4/` files.

The final goal of this task(s) is to import and transform Arazzo Spectral linting rules  into a set of ApiDOM linting rules defined within `packages/apidom-ls/src/config/arazzo` integrating the current ones, ensuring they are not duplication existing ones.

This is the fifth phase of a bigger effort which will include validation of the API definitions in use, the existence of the operationId, etc.

### Procedure

You will keep status and output in a series of markdown files in the `docs/arazzo-rules/phase5` folder, updating them while progressing.
You will first copy into the `docs/arazzo-rules/phase5` folder the `docs/arazzo-rules/phase4/rules-docs.md` and `docs/arazzo-rules/phase4/rules.md` files, and then update them accordingly while progressing.


You will perform this task in the following steps:

1. Understand the rules engine mechanism and the format of the rules, looking at existing arazzo rules and to openapi and asyncapi rules in `packages/apidom-ls/src/config`.
Take your time to understand the rules engine mechanism and the format of the rules.

Understand the current mechanism used in `packages/apidom-ls/src/services/validation/linter-functions.ts` to cache nodes for complex rules needing traversal/filtering.


2. Analyze and understand the Spectral Arazzo rules and related documentation and info.

* Spectral Arazzo Rules Markdown Docs: https://github.com/stoplightio/spectral/blob/develop/docs/reference/arazzo-rules.md
* Spectral Arazzo Rules and functions implementation: https://github.com/stoplightio/spectral/tree/develop/packages/rulesets/src/arazzo/functions

2. Produce an overall plan to achieve the goal and store it in a Markdown file in `/docs/arazzo-rules/phase5`.

The plan must include checkboxes for each step in the plan, to be updated while proceeding.

Double-check the plan accuracy and completeness, and commit it to the repo.

3. On the basis of the plan, analyze the Spectral rules  – along with any other documentation or web page if needed – to identify the rules and the functions to be imported/trasnformed.
Proceed in batches of related rules not to flood context but also don't miss information.

Store the results updating the  "general" Markdown file in `/docs/arazzo-rules/phase5/rules.md` and in a separate file for each target (info, schema) with the rules "data" for each target.
For each identified rule include source links, summary, code, "element" and "target" and provide a task list with checkboxes to be updated while proceeding:

- [] Double check the rule meaning
- [] Create the rule code. The code should follow the existing code style and structure.
- [] Create a test valid fixture for the rule
- [] Create a test invalid fixture for the rule
- [] Create a test case for the rule
- [] Implement the rule importing from the spectral rules and functions if needed. The rule and functions naming should be updated to follow the ApiDOM Ls existing code style and structure.
- [] Test the rule
- [] iterate until test succeeds, don't adapt the test case but fix the rule
- [] create the documentation in markdown in `/docs/arazzo-rules/phase5/rules-docs.md` and `/docs/arazzo-rules/phase5/rules.md`
- [] Update the status

Commit the changes to the repo.

4. Proceed with the rules implementation in batches of related rules. For each one execute the related tasks updating the status while proceeding.

when each batch of rules is implemented, completed, tested and documented commit the changes to the repo.

### Tech notes

* under the hood this makes use of ApiDOM project, providing the `element` and `meta.classes` properties of the node used by the rules engine
* Each final rules definition must be comprehensive and valid according expected structure and content.

### Defined "element" and "classes" values usable as "target" of rules ("main target and/or `target` field in the rule definition")

api
arazzo
arazzo-reference
arazzo-version
arazzoSpecification1
components
components-failure-actions
components-inputs
components-parameters
components-success-actions
criteria
criterion
criterionExpressionType
failure-action-criteria
failureAction
info
JSONSchema
JSONSchema202012 (for JSONSchema 2020-12 specific fields, like `if`, `else`, etc)
parameter
parameters
patterned-field
payloadReplacement
reference-element
reference-value
request-body-replacements
requestBody
reusable
source-description-url
source-descriptions
sourceDescription
spec-version
specification-extension
step
step-depends-on
step-on-failure
step-on-success
step-outputs
step-parameters
step-success-criteria
success-action-criteria
successAction
version
workflow
workflow-depends-on
workflow-failure-actions
workflow-outputs
workflow-parameters
workflow-steps
workflow-success-actions
workflows


### Sources and links

* Spectral Arazzo Rules Markdown Docs: https://github.com/stoplightio/spectral/blob/develop/docs/reference/arazzo-rules.md
* Spectral Arazzo Rules and functions implementation: https://github.com/stoplightio/spectral/tree/develop/packages/rulesets/src/arazzo/functions

* Current ApiDOM functions: `packages/apidom-ls/src/services/validation/linter-functions.ts`
  Understand the current mechanism used in `packages/apidom-ls/src/services/validation/linter-functions.ts` to cache nodes for complex rules needing traversal/filtering.
* Rules root path: `packages/apidom-ls/src/config`
* Arazzo rules root path (target): `packages/apidom-ls/src/config/arazzo`
* Openapi rules root path: `packages/apidom-ls/src/config/openapi`
* Asyncapi rules root path: `packages/apidom-ls/src/config/asyncapi`
* Rules engine docs markdown file: `docs/rules-engine.md`
* Arazzo tests root path: `packages/apidom-ls/test/arazzo/lint`
* Arazzo test fixtures root path: `packages/apidom-ls/test/fixtures/arazzo`

* Arazzo specification: https://github.com/OAI/Arazzo-Specification/blob/main/versions/1.0.1.md
* Arazzo JSON Schema: https://spec.openapis.org/arazzo/1.0/schema/2025-10-15
* Arazzo Web page: https://www.openapis.org/arazzo-specification
* Arazzo spec web site: https://spec.openapis.org/arazzo/
* Arazzo GitHub: https://github.com/OAI/Arazzo-Specification


* ApiDOM project: `/dati/dev/progetti/speclynx/projects/apidom-speclynx/apidom` (https://github.com/speclynx/apidom)

### Tests

Tests and related fixtures should match the example tests already present in the `packages/apidom-ls/test/arazzo/lint` folder.

