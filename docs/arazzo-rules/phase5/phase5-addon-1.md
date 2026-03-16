# Addon 1 to Phase 5: Update JSON Shema testing to include JSON Schema 2020-12 related tests

This addon to phase 5 performed in `docs/arazzo-rules/phase5/plan.md` adds support for multiple sourceDescription in apilintArazzoArrayValuesResolveToWorkflows and apilintArazzoWorkflowIdResolved functiions

With current implementation, rules like the one for `dependsOn` would fail if more than one sourceDescription was provided.

See e.g: https://github.com/OAI/Arazzo-Specification/blob/main/versions/1.0.1.md#fixed-fields-3

```
dependsOn:
A list of workflows that MUST be completed before this workflow can be processed.
Each value provided MUST be a workflowId.
If the workflow depended on is defined within the current Workflow Document, then specify the workflowId of the relevant local workflow.
If the workflow is defined in a separate Arazzo Document then the workflow MUST be defined in the sourceDescriptions and the workflowId MUST be specified using a Runtime Expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes.
```

the functions must be updated to verify if the workflowId id starting with `$sourceDescriptions` and if so, test the runtime expression to be valid.
At this moment we don't want to go into the sourceDescription resolution to verify the expression, use the testRuntimeExpression as in other rules.

Update the relevant tests to include the new cases

Check carefully all involved rules and functions to be applied correctly to the right targets.
