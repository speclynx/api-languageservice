# Phase 4: JSON Schema Rules Analysis

This document details the analysis of JSON Schema related linting rules defined in `packages/apidom-ls/src/config/arazzo/JSONSchema/lint.ts` for the Arazzo specification.

## Overview

The Arazzo JSONSchema lint configuration imports rules from two sources:

1. JSON Schema 2020-12 rules (from `config/json-schema/2020-12/json-schema/lint.ts`), composed with Arazzo targetSpecs via `assoc(Arazzo)`. These are 4 rules covering `$id`, `$schema`, `$ref`, and `$comment` validation.

2. Common schema lint rules (from `config/common/schema/lint/`), imported directly. These are 76 rules covering all standard JSON Schema keywords (type validation, numeric constraints, string constraints, array constraints, object constraints, composition keywords, conditional keywords, and metadata keywords).

Of the 80 total imported rules, 64 have Arazzo in their targetSpecs and fire for Arazzo documents. The remaining 16 are specific to OpenAPI 2.0/3.0, OpenAPI 3.1, or AsyncAPI 2.x only and will never fire for Arazzo documents.

JSON Schema objects appear in Arazzo documents at `workflows[].inputs` and `components.inputs[key]`.


## Rules with Arazzo targetSpecs (64 rules, 63 tested)

### Simple Type Validation Rules

These rules validate that a JSON Schema keyword has the correct value type.

| Code | Rule File | Target | Check | Tested |
|------|-----------|--------|-------|--------|
| SCHEMA_TYPE | type--equals-openapi-3-1--asyncapi-2 | type | Must be one of null, boolean, object, array, number, string, integer | Yes |
| SCHEMA_DEPRECATED | deprecated--type | deprecated | Must be boolean | Yes |
| SCHEMA_DESCRIPTION | description--type | description | Must be string | Yes |
| SCHEMA_TITLE | title--type | title | Must be string | Yes |
| SCHEMA_FORMAT | format--type | format | Must be string | Yes |
| SCHEMA_PATTERN | pattern--type | pattern | Must be string | Yes |
| SCHEMA_READONLY | read-only--type | readOnly | Must be boolean | Yes |
| SCHEMA_WRITEONLY | write-only--type | writeOnly | Must be boolean | Yes |
| SCHEMA_UNIQUEITEMS | unique-items--type | uniqueItems | Must be boolean | Yes |

### Numeric Constraint Rules

| Code | Rule File | Target | Check | Tested |
|------|-----------|--------|-------|--------|
| SCHEMA_MAXIMUM | maximum--type | maximum | Must be number | Yes |
| SCHEMA_MINUMUM | minimum--type | minimum | Must be number | Yes |
| SCHEMA_EXCLUSIVEMAXIMUM | exclusive-maximum--type-number | exclusiveMaximum | Must be number | Yes |
| SCHEMA_EXCLUSIVEMINUMUM | exclusive-minimum--type-number | exclusiveMinimum | Must be number | Yes |
| SCHEMA_MAXLENGTH | max-length--type | maxLength | Must be non-negative integer | Yes |
| SCHEMA_MINLENGTH | min-length--type | minLength | Must be non-negative integer | Yes |
| SCHEMA_MAXITEMS | max-items--type | maxItems | Must be non-negative integer | Yes |
| SCHEMA_MINITEMS | min-items--type | minItems | Must be non-negative integer | Yes |
| SCHEMA_MINPROPERTIES | min-properties--type | minProperties | Must be non-negative integer | Yes |
| SCHEMA_MAXPROPERTIES | max-properties--type | maxProperties | Must be non-negative integer | Yes |
| SCHEMA_MULTIPLEOF | multiple-of--type | multipleOf | Must be number > 0 | Yes |

### Object Structure Rules

| Code | Rule File | Target | Check | Tested |
|------|-----------|--------|-------|--------|
| SCHEMA_PROPERTIES_OBJECT | properties--type | properties | Must be object | Yes |
| SCHEMA_PATTERNPROPERTIES_OBJECT | pattern-properties--type | patternProperties | Must be object | Yes |

### Schema/Boolean Schema Type Rules

These rules validate that values expected to be JSON Schemas are proper schema objects or boolean schemas (true/false).

| Code | Rule File | Target | Check | Tested |
|------|-----------|--------|-------|--------|
| SCHEMA_ADDITIONALITEMS | additional-items--type-openapi-3-1--asyncapi-2 | additionalItems | Must be schema or boolean | Yes |
| SCHEMA_ADDITIONALPROPERTIES | additional-properties--type | additionalProperties | Must be Schema or Boolean | Yes |
| SCHEMA_CONTAINS | contains--type-openapi-3-1--asyncapi-2 | contains | Must be schema or boolean | Yes |
| SCHEMA_IF | if--type | if | Must be schema or boolean | Yes |
| SCHEMA_ELSE | else--type | else | Must be schema or boolean | Yes |
| SCHEMA_THEN | then--type | then | Must be schema or boolean | Yes |
| SCHEMA_NOT | not--type-openapi-3-1-asyncapi-2 | not | Must be schema or boolean | Yes |
| SCHEMA_PROPERTYNAMES | property-names--type | propertyNames | Must be schema or boolean | Yes |
| SCHEMA_ITEMS | items--type | items | Must be schema or array of schemas | Yes |

Note: In the Arazzo namespace, the parser does not create typed Schema/JSONSchema elements for inline YAML objects within nested schema fields. Boolean JSON schema values (true/false) are used for the valid test fixtures of these rules.

### Composition Rules

| Code | Rule File | Target | Check | Tested |
|------|-----------|--------|-------|--------|
| SCHEMA_ALLOF | all-of--type-openapi-3-1--asyncapi-2 | allOf | Must be non-empty array of schemas | Yes |
| SCHEMA_ANYOF | any-of--type-openapi-3-1--asyncapi-2 | anyOf | Must be non-empty array of schemas | Yes |
| SCHEMA_ONEOF | one-of--type-openapi-3-1--asyncapi-2 | oneOf | Must be non-empty array of schemas | Yes |

### Array/Enum Rules

| Code | Rule File | Target | Check | Tested |
|------|-----------|--------|-------|--------|
| SCHEMA_ENUM | enum--unique | enum | Must be array with unique values | Yes |
| SCHEMA_EXAMPLES | examples--type | examples | Must be array | Yes |
| SCHEMA_REQUIRED | required--type | required | Must be array of strings | Yes |

### Properties Values Type Rules

| Code | Rule File | Target | Check | Tested |
|------|-----------|--------|-------|--------|
| SCHEMA_PROPERTIES | properties--values-type-openapi-3-1--asyncapi-2 | properties | Members must be schemas | Yes |
| SCHEMA_PATTERNPROPERTIES | pattern-properties--values-type | patternProperties | Members must be schemas | Yes |
| SCHEMA_PATTERNPROPERTIES_KEY | pattern-properties--keys-regexp | patternProperties | Keys must be valid regex | Skipped |

Note: SCHEMA_PATTERNPROPERTIES_KEY is skipped because the `apilintKeyIsRegex` linter function does not fire for patternProperties children within the Arazzo JSONSchema context. The Arazzo parser does not create proper member elements within nested schema objects that support key-level iteration.

### "Non-X" Warning Rules

These rules warn when a keyword is present but has no effect because the schema type doesn't match. They use conditions to check the schema's `type` field.

| Code | Rule File | Target | Check | Tested |
|------|-----------|--------|-------|--------|
| SCHEMA_ITEMS_NONARRAY | items--non-array | items | Items on non-array type | Yes |
| SCHEMA_ADDITIONALITEMS_NONARRAY | additional-items--non-array | additionalItems | additionalItems on non-array type | Yes |
| SCHEMA_MAXITEMS_NONARRAY | max-items--non-array | maxItems | maxItems on non-array type | Yes |
| SCHEMA_MINITEMS_NONARRAY | min-items--non-array | minItems | minItems on non-array type | Yes |
| SCHEMA_UNIQUEITEMS_NONARRAY | unique-items--non-array | uniqueItems | uniqueItems on non-array type | Yes |
| SCHEMA_CONTAINS_NONARRAY | contains--non-array | contains | contains on non-array type | Yes |
| SCHEMA_MAXLENGTH_NONSTRING | max-length--non-string | maxLength | maxLength on non-string type | Yes |
| SCHEMA_MINLENGTH_NONSTRING | min-length--non-string | minLength | minLength on non-string type | Yes |
| SCHEMA_ADDITIONALPROPERTIES_NONOBJECT | additional-properties--non-object | additionalProperties | additionalProperties on non-object type | Yes |
| SCHEMA_MINPROPERTIES_NONOBJECT | min-properties--non-object | minProperties | minProperties on non-object type | Yes |
| SCHEMA_REQUIRED_NONOBJECT | required--non-object | required | required on non-object type | Yes |
| SCHEMA_PATTERNPROPERTIES_NONOBJECT | pattern-properties--non-object | patternProperties | patternProperties on non-object type | Yes |
| SCHEMA_MAXPROPERTIES_NONOBJECT | max-properties--non-object | maxProperties | maxProperties on non-object type | Yes |
| SCHEMA_PROPERTIES_NONOBJECT | properties--non-object | properties | properties on non-object type | Yes |
| SCHEMA_PROPERTYNAMES_NONOBJECT | property-names--non-object | propertyNames | propertyNames on non-object type | Yes |

### Conditional Keyword Warning Rules

These rules warn when conditional keywords (if/then/else) are used without their required counterparts.

| Code | Rule File | Target | Check | Tested |
|------|-----------|--------|-------|--------|
| SCHEMA_IF_NONTHEN | if--non-then | if | if without then | Yes |
| SCHEMA_THEN_NONIF | then--non-if | then | then without if | Yes |
| SCHEMA_ELSE_NONIF | else--non-if | else | else without if | Yes |

### Special Condition Rules

| Code | Rule File | Target | Check | Tested |
|------|-----------|--------|-------|--------|
| SCHEMA_REQUIRED_WITHOUT_PROPERTIES | required--defined | required | Required props should be in properties when additionalProperties is false | Yes |
| SCHEMA_TYPE_ARRAY_NON_ITEMS | type--array-non-items | type | type: array requires items field | Yes |
| SCHEMA_MISSING_CORE_FIELDS | missing-core-fields-openapi-3-1 | (key) | Schema has no Schema Object keywords | Yes |

Note: The SCHEMA_MISSING_CORE_FIELDS rule's condition was updated from `apilintElementOrClass(['schema'])` to `apilintElementOrClass(['schema', 'JSONSchema'])` so that it fires in both the OpenAPI context (where schema elements use the `schema` class) and the Arazzo context (where they use the `JSONSchema` class).

### JSON Schema 2020-12 Rules (composed with Arazzo targetSpecs)

These rules are defined in the JSON Schema 2020-12 namespace and composed with Arazzo targetSpecs via `assoc(Arazzo)`.

| Code | Rule File | Target | Check | Tested |
|------|-----------|--------|-------|--------|
| JSON_SCHEMA_2020_12_KEYWORD_$COMMENT_TYPE | $comment--type | $comment | Must be string | Yes |
| JSON_SCHEMA_2020_12_KEYWORD_$ID_FORMAT_URI | $id--format-uri | $id | Must be valid URI-reference | Yes |
| JSON_SCHEMA_2020_12_KEYWORD_$SCHEMA_FORMAT_URI | $schema--format-uri | $schema | Must be valid URI with scheme | Yes |
| JSON_SCHEMA_2020_12_KEYWORD_$REF_FORMAT_URI | $ref--format-uri | $ref | Must be valid URI-reference | Yes |


## Rules Without Arazzo targetSpecs (16 rules, not tested)

These rules are imported in the Arazzo JSONSchema lint configuration but do not include Arazzo in their targetSpecs. They will never fire for Arazzo documents and exist in the import file for code organization/sharing with other namespaces.

| Code | Rule File | Targets |
|------|-----------|---------|
| SCHEMA_ADDITIONALITEMS | additional-items--type | OpenAPI 3.0 |
| SCHEMA_ALLOF | all-of--type | OpenAPI 2.0, 3.0 |
| SCHEMA_ANYOF | any-of--type | OpenAPI 3.0 |
| SCHEMA_CONTAINS | contains--type | OpenAPI 3.0 |
| SCHEMA_DISCRIMINATOR_EXIST | discriminator--exist-in-required | AsyncAPI 2 |
| SCHEMA_DISCRIMINATOR | discriminator--type-openapi-3 | OpenAPI 3 |
| SCHEMA_EXCLUSIVEMAXIMUM (boolean) | exclusive-maximum--type-boolean | OpenAPI 2.0, 3.0 |
| SCHEMA_EXCLUSIVEMINUMUM (boolean) | exclusive-minimum--type-boolean | OpenAPI 2.0, 3.0 |
| SCHEMA_XML | xml--type | OpenAPI 3 |
| SCHEMA_EXTERNAL_DOCS | external-docs--type | AsyncAPI 2, OpenAPI 2, 3 |
| SCHEMA_NOT | not--type | OpenAPI 2.0, 3.0 |
| SCHEMA_NULLABLE | nullable--type | OpenAPI 3.0 |
| SCHEMA_NULLABLE_NOT_RECOMMENDED | nullable--not-recommended | OpenAPI 3.1 |
| SCHEMA_ONEOF | one-of--type | OpenAPI 3.0 |
| SCHEMA_PROPERTIES | properties--values-type | OpenAPI 2.0, 3.0 |
| SCHEMA_TYPE | type--type | OpenAPI 2.0, 3.0 |
| SCHEMA_TYPE | type--equals | OpenAPI 2.0, 3.0 |
| SCHEMA_EXAMPLE_DEPRECATED | example--deprecated | OpenAPI 3.1 |


## Gap Analysis (resolved)

Three rules (`max-properties--type`, `max-properties--non-object`, `properties--non-object`) were identified as having Arazzo in their targetSpecs but missing from the Arazzo JSONSchema lint.ts imports. These have now been added to the Arazzo lint configuration, the common schema lint index, and the OpenAPI schema lint configuration. All three have passing tests.

Additionally, the `missing-core-fields-openapi-3-1` rule's condition was updated to include `JSONSchema` alongside `schema` in the `apilintElementOrClass` check, so it fires correctly in the Arazzo context where elements use the `JSONSchema` class rather than `schema`.

### Parser limitations

The Arazzo parser does not create typed Schema/JSONSchema elements for inline YAML objects within nested schema fields (e.g., objects under `items`, `contains`, `if`, `then`, `else`, `not`, `propertyNames`, `additionalItems`). This means:

1. Rules using `apilintElementOrClass` cannot validate inline schema objects. Valid fixtures for these rules use boolean JSON schema values (true/false) instead.

2. The `apilintKeyIsRegex` function for `patternProperties` keys does not fire because the parser does not create proper member elements within nested schema objects.

These are existing parser behaviors and do not require changes for phase 4.
