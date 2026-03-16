## Phase 4 - JSON Schema rules tests


### Goal

This is the fourth phase of a process meant to transform the Arazzo Specification and JSON Schema into a set of ApiDOM linting rules to be defined within `packages/apidom-ls/src/config/arazzo` integrating the current ones.
The resulting linting rules will provide a comprehensive set of checks to ensure that API definitions adhere to the arazzo specification and its related JSON Schema.
If there are discrepancies between the specification and the JSON Schema, the specification MD file will take precedence.

The first phase was implemented according to the "meta plan" defined in `docs/arazzo-rules/import-meta-plan.md`, this has been documented in `docs/arazzo-rules/phase1/` files.
The second phase was implemented according to the "meta plan" defined in `docs/arazzo-rules/import-meta-plan-phase2.md`, this has been documented in `docs/arazzo-rules/phase2/` files.
The third phase was implemented according to the "meta plan" defined in `docs/arazzo-rules/import-meta-plan-phase3.md`, this has been documented in `docs/arazzo-rules/phase3/` files.

In this fourth phase you will add comprehensive tests for the rules defined in `packages/apidom-ls/src/config/arazzo/JSONSchema/lint.ts` (all defined in `packages/apidom-ls/src/config/common/schema/lint`) and verify that they are adherent to the specification.


### Procedure

You will keep status and output in a series of markdown files in the `docs/arazzo-rules/phase4` folder, updating them while progressing.
You will first copy into the `docs/arazzo-rules/phase4` folder the `docs/arazzo-rules/phase3/rules-docs.md` and `docs/arazzo-rules/phase3/rules.md` files, and then update them accordingly while progressing.

You will perform this task in the following steps:

1. Iterate the JSON Schema related rules above, understanding their purpose and the target "snippets".

2. Check if the rule is adherent to the specification, if it is clear, tested, and it has all the "must have" in the list below.

Detail the result of the analyis in a markdown file in `docs/arazzo-rules/phase4/schema.md`.

We expect that there is no schema related tests yet.

Each rule must have:

- [] be adherent to the specification
- [] a good rule code
- [] a test valid fixture for the rule (double checked)
- [] a test invalid fixture for the rule (double checked)
- [] test case for the rule
- [] the Test executed successfully
- [] documentation in markdown in `/docs/arazzo-rules/phase4/rules-docs.md`


Provide the detailed result of these iterations in a md file in  `docs/arazzo-rules/phase4`.

2. iterate ALL identified "problems" ("bad rule, no testing, fixtures, docs, etc.) and fix each one by implementing all related artifacts, fixtures, tests, etc.

Maintain the result while progressing in the markdown files.

Fully test the rules and fix any remaining problems.

3. Iterate ALL the implemented rules and verify that each one includes all "must have" in the list above.

If this is not the case fix the related issues and test the rule
