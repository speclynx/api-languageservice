## Thorough validation, refinement, and enhancement iteration on rules


### Goal

This is the third phase of a process meant to transform the Arazzo Specification and JSON Schema into a set of ApiDOM linting rules to be defined within `packages/apidom-ls/src/config/arazzo` integrating the current ones.
The resulting linting rules will provide a comprehensive set of checks to ensure that API definitions adhere to the arazzo specification and its related JSON Schema.
If there are discrepancies between the specification and the JSON Schema, the specification MD file will take precedence.

The first phase was implemented according to the "meta plan" defined in `docs/arazzo-rules/import-meta-plan.md`, this has been documented in `docs/arazzo-rules/phase1/` files.
The second phase was implemented according to the "meta plan" defined in `docs/arazzo-rules/import-meta-plan-phase2.md`, this has been documented in `docs/arazzo-rules/phase2/` files.

In this third phase you will further validate, refine, and enhance the rules already defined, adding new ones if they are missing or fixing if they are not adherent to the specification.

This includes particularly:

* more complex rules inferable from the specification but missing in the implemented set.
* rules without documentation in docs

This work must be performed in batches, each batch should process rules for a single "target" and markdown documents in its own folder, e.g. `docs/arazzo-rules/phase3/info`.

"targets":

[arazzoSpecification1](../../packages/apidom-ls/src/config/arazzo/arazzoSpecification1)
[components](../../packages/apidom-ls/src/config/arazzo/components)
[criterion](../../packages/apidom-ls/src/config/arazzo/criterion)
[criterionExpressionType](../../packages/apidom-ls/src/config/arazzo/criterionExpressionType)
[failureAction](../../packages/apidom-ls/src/config/arazzo/failureAction)
[info](../../packages/apidom-ls/src/config/arazzo/info)
[JSONSchema](../../packages/apidom-ls/src/config/arazzo/JSONSchema)
[parameter](../../packages/apidom-ls/src/config/arazzo/parameter)
[payloadReplacement](../../packages/apidom-ls/src/config/arazzo/payloadReplacement)
[requestBody](../../packages/apidom-ls/src/config/arazzo/requestBody)
[reusable](../../packages/apidom-ls/src/config/arazzo/reusable)
[sourceDescription](../../packages/apidom-ls/src/config/arazzo/sourceDescription)
[step](../../packages/apidom-ls/src/config/arazzo/step)
[successAction](../../packages/apidom-ls/src/config/arazzo/successAction)
[workflow](../../packages/apidom-ls/src/config/arazzo/workflow)

**NOTE:** if you find a rule in the specification that doesn't have a corresponding "target" in the implemented set, please add it.

### Example of missing rules

**NOTE: THIS IS JUST AN EXAMPLE, you must carefully analyze and idenfity other missing rules.

1. `operationPath` and `operationId` are mutually exclusive, see: https://github.com/OAI/Arazzo-Specification/blob/main/versions/1.0.1.md#step-object


### Procedure

You will keep status and output in a series of markdown files in the `docs/arazzo-rules/phase3` folder, updating them while progressing.
You will keep status and output of the single batches in a series of markdown files in a `docs/arazzo-rules/phase3/{target}` folder (e.g. `docs/arazzo-rules/phase3/step`), updating them while progressing.
You will first copy into the `docs/arazzo-rules/phase3` folder the `docs/arazzo-rules/phase2/rules-docs.md` and `docs/arazzo-rules/phase2/rules.md` files, and then update them accordingly while progressing.

You will perform this task in the following steps:


1. Iterate the "targets" above, and carefully analyze the specification's related section, understanding eache field description and rule, including comple multi-field ones

2. for each field and field details verify if a rule can be derived from it. If so check if this is included the implemented rules.

If it is included, check if the rule is adherent to the specification, if it is clear, tested, and if it has a test fixture, and if it has documentation in the docs.
Check also if the valid and invalid fixtures are correct. Detail the result of the analyis in a markdown file in `docs/arazzo-rules/phase3/{target}`.

If it is not included, add it to the list of rules to be implemented.

Each rule must have:

- [] be adherent to the specification
- [] a good rule code
- [] a test valid fixture for the rule (double checked)
- [] a test invalid fixture for the rule (double checked)
- [] test case for the rule
- [] the rule definition in `packages/apidom-ls/src/config/arazzo/`
- [] the Test executed successfully
- [] documentation in markdown in `/docs/arazzo-rules/phase3/rules-docs.md`


Provide the detailed result of these iterations in a md file in  `docs/arazzo-rules/phase3`.

2. iterate ALL identified "problems" (e.g. missing rule) and fix each one by implementing missing rule and all related artifacts, fixtures, tests, etc.

Maintain the result while progressing in the markdown files.

At the end of each batch, fully test the rules and fix any remaining problems. Then commit and proceed with the next batch.

3. Iterate ALL the implemented rules and verify that each one includes all "must have" in the list above.

If this is not the case fix the related issues and test the rule
