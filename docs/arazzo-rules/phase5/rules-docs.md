# Arazzo 1.0.1 Linting Rules Documentation

This document provides detailed documentation for all Arazzo linting rules after Phase 3 validation, refinement, and enhancement.

## Overview

The rules provide structural validation of Arazzo 1.0.1 documents, verifying conformance to the specification in terms of required fields, field types, allowed values, naming patterns, and structural constraints. The rules are organized by the Arazzo specification objects they target.

All rules are implemented as `LinterMeta` definitions under `packages/apidom-ls/src/config/arazzo/` and follow the existing codebase patterns. Error codes use the `9XXYYZZ` numbering scheme where `XX` identifies the object category (04 for root spec, 05 for source description, 06 for workflow, etc.).

## Arazzo Specification Object

The root object of an Arazzo document must include the `arazzo` version string, an `info` object, a non-empty `sourceDescriptions` array, and a non-empty `workflows` array. An optional `components` object may be present. Specification extensions with the `x-` prefix are allowed.

The `arazzo` field must match the pattern `^1\.0\.\d+(-.+)?$`, ensuring it is a valid 1.0.x version string. The `sourceDescriptions` and `workflows` arrays are validated both for correct element types (sourceDescription and workflow respectively) and for non-emptiness.

## Info Object

The Info Object provides metadata about the Arazzo document. The `title` and `version` fields are required. The optional `summary` and `description` fields, when present, must be strings. All four fields undergo type validation. Specification extensions are allowed.

## Source Description Object

Each Source Description identifies a referenced API document. The `name` and `url` fields are required. The `name` must match `[A-Za-z0-9_\-]+` to ensure it follows valid identifier conventions. When the optional `type` field is present, it must be either `"openapi"` or `"arazzo"`.

## Workflow Object

A Workflow describes a sequence of steps. The `workflowId` and `steps` fields are required. The `workflowId` must match `[A-Za-z0-9_\-]+` and the `steps` array must contain at least one entry. Optional fields include `summary`, `description`, `inputs` (a JSON Schema object), `dependsOn` (array of strings), `successActions` and `failureActions` (arrays of Success/Failure Action or Reusable Objects), `outputs` (an object whose keys must match `[a-zA-Z0-9.\-_]+` and whose values must be strings representing Runtime Expressions), and `parameters` (array of Parameter or Reusable Objects).

## Step Object

A Step represents a single operation within a workflow. The `stepId` is required and must match `[A-Za-z0-9_\-]+`. The step should reference an operation or workflow via `operationId`, `operationPath`, or `workflowId` (all string types when present). These three fields are mutually exclusive: specifying `operationId` means `operationPath` and `workflowId` must be absent, and likewise for each of the other two fields. Optional fields include `description`, `parameters`, `requestBody` (a Request Body Object), `successCriteria` (array of Criterion Objects), `onSuccess` and `onFailure` (arrays of action/reusable objects), and `outputs` (an object whose keys must match `[a-zA-Z0-9.\-_]+` and whose values must be strings representing Runtime Expressions).

## Parameter Object

A Parameter specifies a value to pass to an operation or workflow. The `name` and `value` fields are required. When present, the `in` field must be one of `"path"`, `"query"`, `"header"`, or `"cookie"`. Only name, in, and value fields are allowed alongside extensions.

## Success Action Object

A Success Action defines behavior on step success. Both `name` and `type` are required. The `type` must be either `"end"` or `"goto"`. Optional fields include `workflowId` and `stepId` (both strings), which are mutually exclusive with each other. These fields are only relevant when the `type` is `"goto"`. The optional `criteria` field is an array of Criterion Objects.

## Failure Action Object

A Failure Action defines behavior on step failure. Both `name` and `type` are required. The `type` must be one of `"end"`, `"goto"`, or `"retry"`. The `workflowId` and `stepId` fields are mutually exclusive with each other and are only relevant when the `type` is `"goto"` or `"retry"`. The `retryAfter` (a non-negative number representing seconds) and `retryLimit` (a non-negative integer) fields only apply when the `type` is `"retry"`. The optional `criteria` field is an array of Criterion Objects.

## Components Object

The Components Object holds reusable definitions. All four fields (`inputs`, `parameters`, `successActions`, `failureActions`) are optional objects. When present, their values are type-checked: `inputs` values must be JSON Schema Objects, `parameters` values must be Parameter Objects, `successActions` values must be Success Action Objects, and `failureActions` values must be Failure Action Objects. All component map keys must match the pattern `^[a-zA-Z0-9.\-_]+$`.

## Criterion Object

A Criterion defines a condition for evaluating success. The `condition` field is required and must be a string. The optional `context` must be a string (Runtime Expression). When the `type` field is specified, the `context` field MUST also be provided. The `type` field, when present as a string, must be one of `"simple"`, `"regex"`, `"jsonpath"`, or `"xpath"`. It may also be a Criterion Expression Type Object.

## Criterion Expression Type Object

This object specifies the expression language for criteria. Both `type` and `version` are required. The `type` must be `"jsonpath"` or `"xpath"`. The `version` must be a string identifying the specific language version.

## Request Body Object

The Request Body provides content for operations. The optional `contentType` must be a string (media type). The `payload` field accepts any value. The `replacements` field, when present, must be an array of Payload Replacement Objects.

## Payload Replacement Object

A Payload Replacement specifies a location and value to inject into a request body. Both `target` (a JSON Pointer or XPath expression string) and `value` are required.

## Reusable Object

The Reusable Object references components for reuse. The `reference` field (a Runtime Expression string) is required. The optional `value` must be a string. Unlike all other Arazzo objects, the Reusable Object does not allow specification extensions; only `reference` and `value` are permitted.

## JSON Schema (inputs)

Arazzo uses JSON Schema 2020-12 for the `inputs` field of Workflow Objects and the `inputs` values in Components. The JSON Schema rules validate type correctness for all standard JSON Schema keywords across the Core, Applicator, Validation, Format, Content, and Meta-Data vocabularies.

Key validations include type checking for numeric keywords (`maxLength`, `minLength`, `maximum`, `minimum`, `maxItems`, `minItems`, `maxProperties`, `minProperties`, `multipleOf` must be non-negative integers or numbers as appropriate), boolean keywords (`deprecated`, `readOnly`, `writeOnly`, `uniqueItems` must be booleans), string keywords (`title`, `description`, `pattern`, `format` must be strings), and structural keywords (`properties`, `patternProperties` must be objects with schema values, `allOf`/`anyOf`/`oneOf` must be arrays of schemas, `not`/`if`/`then`/`else`/`items`/`contains`/`additionalProperties`/`propertyNames` must be schema objects).

Contextual warnings flag `properties`/`patternProperties`/`propertyNames` on non-object schemas, `items`/`maxItems`/`minItems`/`uniqueItems`/`contains` on non-array schemas, and `maxLength`/`minLength` on non-string schemas. The `required` keyword warns when used without `properties`. The `example` keyword triggers a deprecation warning recommending `examples` instead.

OpenAPI-specific keywords (`discriminator`, `nullable`, `xml`, `externalDocs`) are not validated in the Arazzo context since Arazzo uses pure JSON Schema 2020-12 rather than the OpenAPI Schema Object dialect. Similarly, `$ref` is allowed to have sibling keywords per JSON Schema 2020-12 semantics.

JSON Schema 2020-12 identifier keywords (`$id`, `$schema`, `$ref`, `$comment`) are validated through composed rules from the JSON Schema 2020-12 namespace. The `$id` and `$ref` fields must be valid URI-references, `$schema` must be a valid URI with a scheme, and `$comment` must be a string.

## Phase 4: JSON Schema Test Coverage

Phase 4 added comprehensive tests for all 64 JSON Schema rules that include Arazzo in their targetSpecs. All 64 rules are fully tested with valid and invalid YAML fixture pairs. The `SCHEMA_PATTERNPROPERTIES_KEY` rule was fixed by replacing the non-functional `apilintKeyIsRegex` with a new `apilintChildrenKeysAreRegex` function that correctly iterates child member keys for regex validation.

The test file is at `test/arazzo/lint/JSONSchema/JSONSchema.ts` and fixtures are under `test/fixtures/arazzo/JSONSchema/<CODE>/`. Each test validates that the invalid fixture produces at least one diagnostic with the expected error code, and the valid fixture produces no diagnostics with that code.

Phase 4 also identified and resolved three import gaps: `max-properties--type`, `max-properties--non-object`, and `properties--non-object` had Arazzo in their targetSpecs but were missing from the Arazzo JSONSchema lint configuration. These were added to the Arazzo, OpenAPI, and common lint configurations and are now fully tested. The `missing-core-fields-openapi-3-1` rule condition was updated to check for both `schema` and `JSONSchema` element classes.

Investigation revealed that the Arazzo parser correctly creates `JSONSchema202012` elements for nested schema fields (`items`, `contains`, `if`/`then`/`else`, `not`, `additionalProperties`, `propertyNames`). The 14 lint rules using `apilintElementOrClass` were updated to include `JSONSchema202012` in their allowed types, and test fixtures were updated from boolean workarounds to proper inline schema objects.
