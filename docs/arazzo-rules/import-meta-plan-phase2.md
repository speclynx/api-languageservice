## Validation, refinement and enhancement iteration on rules


### Goal

This is the second phase of a process meant to transform the Arazzo Specification and JSON Schema into a set of ApiDOM linting rules to be defined within `packages/apidom-ls/src/config/arazzo` integrating the current ones in draft status.
The resulting linting rules will provide a comprehensive set of checks to ensure that API definitions adhere to the arazzo specification and its related JSON Schema.
If there are discrepancies between the specification and the JSON Schema, the specification MD file will take precedence.

The first phase was implemented according to the "meta plan" defined in `docs/arazzo-rules/import-meta-plan.md`, this has been documented in `docs/arazzo-rules/phase1/` files.

In this second phase you will validate, refine, and enhance the rules already defined, adding new ones if they are missing or if they are not adherent to the specification.

This includes:

* missing rules
* rules not adherent to the specification
* redundant rules
* rules that are not needed
* rules that are not applicable
* rules that are not clear
* rules not tested
* rules with wrong test fixtures
* rules without documentation in docs

### Example of missing or wrong or incomplete rules, or rules without a test

**NOTE: THIS IS A SMALL NON-EXHAUSTIVE SUBSET OF RULES THAT NEED TO BE CHECKED AND FIXED.**

1. The rules for fields at the root of the arazzo document seem not to be implemented. See e.g. `arazzo` string field, allowed values, `workflows` as array of workflow etc
2. The majority of Schema rules tests are not implemented.
3. Workflow `outputs` field has no linting rules for the value of the map items, which should be an expression according to https://github.com/OAI/Arazzo-Specification/blob/main/versions/1.0.1.md#runtime-expressions
    In this phase we want just to check that the expression is a string. There are probably other fields in the specification which are runtime expressions. these must be fixed or added as well.

There are probably many more rules that need to be checked and fixed.

### Procedure

You will keep status and output in a series of markdown files in the `docs/arazzo-rules/phase2` folder, updating them while progressing.
You will first copy into the `docs/arazzo-rules/phase2` folder the `docs/arazzo-rules/phase/rules-docs.md` and `docs/arazzo-rules/phase/rules.md` files, and then update them accordingly while progressing.

You will perform this task in the following steps:

1. Iterate the specification with care, and for each field and field details verify if a rule can be derived from it. If so check if this is included the implemented rules.

If it is included, check if the rule is adherent to the specification, if it is clear, tested, and if it has a test fixture, and if it has documentation in the docs.
Check also if the valid and invalid fixtures are correct. Detail the result of the analyis in a markdown file in `docs/arazzo-rules/phase2`.

If it is not included, add it to the list of rules to be implemented.

Each rule must have:

- [] be adherent to the specification
- [] a good rule code
- [] a test valid fixture for the rule (double checked)
- [] a test invalid fixture for the rule (double checked)
- [] test case for the rule
- [] the rule definition in `packages/apidom-ls/src/config/arazzo/`
- [] the Test executed successfully
- [] documentation in markdown in `/docs/arazzo-rules/phase1/rules-docs.md`


Provide the detailed result of these iterations in a md file in  `docs/arazzo-rules/phase2`.

2. iterate ALL identified "problems" (e.g. missing rule, wrong rule, etc) and fix each one, e.g. by implementing missing rule, fix wrong rule, etc.

Maintain the result while progressing in the markdown files.
Proceed in batches not to flood context and PR with too many changes. at the end of each batch, fully test the rules and fix any remaining problems. Then commit and proceed with the next batch.

3. Iterate ALL the implemented rules and verify that each one includes all "must have" in the list above.

If this is not the case fix the related issues and test the rule
