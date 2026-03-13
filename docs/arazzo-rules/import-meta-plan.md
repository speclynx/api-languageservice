## Transformation of Arazzo Specification + JSON Schema into set of ApiDOM linting rules

### Goal

The final goal of this task(s) is to transform the Arazzo Specification and JSON Schema into a set of ApiDOM linting rules to be defined within `packages/apidom-ls/src/config/arazzo` integrating the current ones in draft status.
The resulting linting rules will provide a comprehensive set of checks to ensure that API definitions adhere to the arazzo specification and its related JSON Schema.
If there are discrepancies between the specification and the JSON Schema, the specification MD file will take precedence.

This is the first phase of a bigger effort which will include validation of the API definitions in use, the existence of the operationId, etc.

### Procedure

You will perform this task in the following steps:

1. Understand the rules engine mechanism and the format of the rules, looking at existing arazzo rules in draft status and to openapi and asyncapi rules in `packages/apidom-ls/src/config`.
Take your time to understand the rules engine mechanism and the format of the rules.

The "target" possible values are identified in section below titled `Defined "element" and "classes" values usable as "target" of rules ("main target and/or target field in the rule definition")`

2. Produce an overall plan to achieve the goal and store it in a Markdown file in `/docs/arazzo-rules/phase1`.

The plan must include checkboxes for each step in the plan, to be updated while proceeding.

Double-check the plan accuracy and completeness, and commit it to the repo.

3. On the basis of the plan, analyze the Arazzo Specification and JSON Schema – along with any other documentation or web page if needed – to identify the rules to be implemented. Proceed in batches of related rules not to flood context but also don't miss information.

Store the results in a "general" Markdown file in `/docs/arazzo-rules/phase1/rules.md` and in a separate file for each target (info, schema) with the rules "data" for each target.
For each identified rule include source links, summary, code, "element" and "target" and provide a task list with checkboxes to be updated while proceeding:

- [] Double check the rule meaning
- [] Create the rule code
- [] Create a test valid fixture for the rule
- [] Create a test invalid fixture for the rule
- [] Create a test case for the rule
- [] Implement the rule
- [] Test the rule
- [] iterate until test succeeds, don't adapt the test case but fix the rule
- [] create the rule documentation in markdown in `/docs/arazzo-rules/phase1/rules-docs.md`
- [] Update the status

Commit the changes to the repo.

4. Proceed with the rules implementation in batches of related rules. For each one execute the related tasks updating the status while proceeding.

when each batch of rules is implemented, completed, tested and documented commit the changes to the repo.

----

Adapt this procedure if you see evident issues with the current approach, ask first for feedback.

### Tech notes

* JSON Schema rules are already implemented and in fairly good shape. For these just integrate or fix what missing/wrong (pay attention to the `discriminator` property) and add the markdown files and tests
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

* Arazzo specification: https://github.com/OAI/Arazzo-Specification/blob/main/versions/1.0.1.md
* Arazzo JSON Schema: https://spec.openapis.org/arazzo/1.0/schema/2025-10-15
* Arazzo Web page: https://www.openapis.org/arazzo-specification
* Arazzo spec web site: https://spec.openapis.org/arazzo/
* Arazzo GitHub: https://github.com/OAI/Arazzo-Specification

* Rules root path: `packages/apidom-ls/src/config`
* Arazzo rules root path (target): `packages/apidom-ls/src/config/arazzo`
* Openapi rules root path: `packages/apidom-ls/src/config/openapi`
* Asyncapi rules root path: `packages/apidom-ls/src/config/asyncapi`
* Rules engine docs markdown file: `docs/rules-engine.md`
* Arazzo tests root path: `packages/apidom-ls/test/arazzo/lint`
* Arazzo test fixtures root path: `packages/apidom-ls/test/fixtures/arazzo`

* ApiDOM project: `/dati/dev/progetti/speclynx/projects/apidom-speclynx/apidom` (https://github.com/speclynx/apidom)

### Tests

Tests and related fixtures should match the example tests already present in the `packages/apidom-ls/test/arazzo/lint` folder.

see e.g. `packages/apidom-ls/test/arazzo/lint/info/info.ts` and `packages/apidom-ls/test/fixtures/arazzo/info/ARAZZO_INFO_FIELD_DESCRIPTION_TYPE`
