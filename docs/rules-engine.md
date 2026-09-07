# Rules Engine

The SpecLynx API Language Service includes a declarative rules engine that validates API description documents (OpenAPI, AsyncAPI, JSON Schema, etc.) by evaluating a set of rules against a parsed ApiDOM tree. This document describes the architecture, rule format, built-in linter functions, and how to create custom rules.

## Architecture overview

The rules engine operates within the validation service (`packages/api-languageservice/src/services/validation/validation-service.ts`). When a document is validated, the service parses the text into an ApiDOM element tree, then traverses that tree evaluating applicable rules against each element. Each rule that fails produces an LSP `Diagnostic` with a message, severity, source location, and optional quick-fix data.

The main components are:

```
config/config.ts
  Aggregates all built-in rules from spec-specific configs (openapi/, asyncapi/, etc.)
  into a Metadata object keyed by namespace.

validation-service.ts (DefaultValidationService)
  Traverses the ApiDOM tree and applies rules from two sources:
    1. Element-level rules: attached to specific element types in metadataMaps
    2. Namespace-level rules: stored in metadata.rules[namespace].lint with a `given` field

linter-functions.ts
  Provides the library of standard linter functions referenced by name in rule definitions.

utils.ts (checkConditions)
  Evaluates conditions before applying a rule, supporting path navigation and negation.
```

### Validation modes

The validation service supports several independent modes, controlled through the `ValidationContext`:

`semanticValidation` enables structural validation rules (the `VALIDATION` category), such as required fields and allowed fields. `semanticLinting` enables style and convention rules (the `LINT` category), such as naming conventions and best practices. `referenceValidation` validates `$ref` pointers resolve correctly. `jsonSchemaValidation` delegates to registered JSON Schema validation providers.

Each mode can be enabled or disabled independently. Rules declare which category they belong to via the `category` field.

### Rule application flow

When `doValidation` is called, the service follows this sequence:

First, it checks for validation providers that override default validation (e.g., a provider with `overrideDefaultValidation()` returning true). If one matches the document's namespace and version, it handles all validation and the service returns early.

If no override provider matches and semantic validation or linting is enabled, the service parses the document and traverses the ApiDOM tree using `forEach`. For each element, it determines the element's classes (e.g., `server`, `operation`, `pathItem`) and looks up matching rules from the metadata map for that element symbol. Rules are filtered by namespace, spec version, and category before evaluation.

After the full tree traversal, the service also processes namespace-level rules that use JSONPath `given` expressions. These rules specify one or more JSONPath expressions that select elements from the document, and the rule is evaluated against each matched element.

Finally, if no syntax errors were found, the service runs any registered validation providers (such as JSON Schema validators) that operate in `FULL` mode.

## Rule format (LinterMeta)

Every rule is defined as an object conforming to the `LinterMeta` interface from `apidom-language-types.ts`. Here is a complete reference of all fields:

### Core fields

`code` (number): A numeric error code from the `ApilintCodes` enum in `config/codes.ts`. Error codes are organized by ranges: 10000-14999 for schema rules, 14999 for duplicate keys, 15000 for not-allowed-fields, 20000+ for AsyncAPI, 30000+ for OpenAPI.

`message` (string): The diagnostic message displayed to the user when the rule fails.

`source` (string): The diagnostic source identifier. Always `'apilint'` for rules engine rules.

`severity` (DiagnosticSeverity): The severity level of the diagnostic. Uses the LSP enum values: 1 (Error), 2 (Warning), 3 (Information), 4 (Hint).

### Function and parameters

`linterFunction` (string): The name of the function to execute for this rule. The service looks it up via `standardLinterfunctionsMap` (an O(1) Map) from `linter-functions.ts`, then falls back to custom functions registered in `metadata.linterFunctions[namespace]`. The function must return `true` if validation passes and `false` if it fails.

`linterParams` (unknown[]): An array of parameters passed to the linter function after the target element. For example, `linterFunction: 'hasRequiredField'` with `linterParams: ['url']` calls `hasRequiredField(element, 'url')`.

`negate` (boolean): When true, inverts the result of the linter function. This allows reusing existing functions for opposite checks without writing new ones.

### Targeting

`target` (string): A field name within the current object element. When set, the linter function receives the value of this field instead of the element itself. If the target field doesn't exist on the element, the rule is skipped. For example, `target: 'url'` means the rule validates the value of the `url` field.

`marker` (string): Controls where the diagnostic underline appears. `'key'` highlights the property key, `'value'` highlights the property value. When not specified, the element's own source map position is used.

`markerTarget` (string): An alternative field name whose position is used for the diagnostic marker, independent of what `target` the linter function operates on. Useful when you want to validate one field but highlight a different one.

### Specification scoping

`targetSpecs` (NamespaceVersion[]): An array of namespace/version pairs that this rule applies to. The service matches against the document's detected namespace and version. Version strings can use `x` as a wildcard suffix (e.g., `'3.0.x'` matches any 3.0.* version). Predefined constants are available in `config/openapi/target-specs.ts` and `config/asyncapi/target-specs.ts`, such as `OpenAPI3`, `OpenAPI30`, `OpenAPI31`, `AsyncAPI2`. `config/arazzo/target-specs.ts` follows the same pattern: `Arazzo100`/`Arazzo101`/`Arazzo110` (individual exact versions, exported for API compatibility but not used to build the aggregates below, since the wildcard they'd add to already subsumes them), `Arazzo10`/`Arazzo10X` (the 1.0 line - `1.0.x` prefix-matches every 1.0 patch version), `Arazzo11`/`Arazzo11X` (the 1.1 line), and `Arazzo`/`Arazzo1` (everything). Always target a wildcard-inclusive constant like `Arazzo10`/`Arazzo11`/`Arazzo` rather than an exact-version-only one - omitting the wildcard means the rule silently stops matching any future patch version that isn't explicitly enumerated.

When `targetSpecs` is omitted, the rule applies to all specs within its namespace.

### Conditions

`conditions` (LinterCondition[]): An array of conditions that must all pass before the rule's linter function is executed. Each condition has:

`conditions[].function` (string): The name of a linter function to evaluate as the condition. Uses the same lookup mechanism as the rule's `linterFunction`.

`conditions[].params` (unknown[]): Parameters passed to the condition function after the target element.

`conditions[].negate` (boolean): Inverts the condition result.

`conditions[].targets` (LinterConditionTarget[]): Specifies which element(s) to evaluate the condition against, instead of the current element. Each target has a `path` that supports dot-separated navigation: `'parent'` moves to the parent member's parent element, `'root'` moves to the API root, and any other string navigates to a child field by name. For example, `{ path: 'parent.parent' }` navigates two levels up, and `{ path: 'url' }` navigates to the `url` child.

### Element selection (given)

`given` (string | string[]): Used for namespace-level rules (stored in `metadata.rules`), this specifies which elements the rule applies to. The format depends on `givenFormat`.

`givenFormat` (LinterGivenFormat): Either `'SEMANTIC'` (the default) or `'JSONPATH'`. When semantic, the `given` values are ApiDOM element type names or class names (e.g., `'parameter'`, `'server'`). When JSONPath, they are JSONPath expressions evaluated against the API root (e.g., `'$.components.schemas.*.properties.*'`).

### Category

`category` (DiagnosticCategory): Either `'Validation'` or `'Lint'`. Validation rules represent structural correctness issues (required fields, type constraints), while lint rules represent style and convention checks (naming, casing). If not specified, defaults to `'Validation'`.

### Quick fixes

`data` (LinterMetaData): Contains an optional `quickFix` array of `QuickFixData` objects that provide automated code actions. Each quick fix has:

`data.quickFix[].message` (string): The label shown in the IDE's code action menu.

`data.quickFix[].action` (string): The type of fix. `'updateValue'` replaces the value at the diagnostic range. `'addChild'` inserts a new child at the element. `'removeChild'` removes a child element.

`data.quickFix[].snippetYaml` / `data.quickFix[].snippetJson` (string): Code snippets for the `addChild` action, format-specific.

`data.quickFix[].functionParams` (any[]): Parameters for the fix, e.g., the new value for `updateValue`.

### Informational fields

`name` (string): A human-readable identifier for the rule (e.g., `'SB-API-050-property-names'`). Not used by the engine but useful for documentation and custom rule management.

`description` (string): A longer description of the rule's purpose.

`summary` (string): A short summary of the rule.

`recommended` (boolean): Whether this rule is recommended for inclusion in a default ruleset.

## Built-in linter functions

All standard linter functions are defined in `packages/api-languageservice/src/services/validation/linter-functions.ts` and exported as the `standardLinterfunctions` array. Each function takes an element as its first argument and returns a boolean (true = passes, false = fails).

### Field existence

`hasRequiredField(element, key)` returns false if the object element does not have the specified key. Used for required field validation.

`missingField(element, key)` returns false if the object element *does* have the specified key. Used to assert a field must not be present.

`missingFields(element, keys[])` returns false if the element has *any* of the specified keys. Used for mutual exclusivity checks.

`existFields(element, keys[])` returns false if the element is missing *any* of the specified keys. Used when multiple fields must all be present.

`existAnyOfFields(element, keys[], allowEmpty?)` returns false if the element has none of the specified keys. The `allowEmpty` parameter controls behavior when the element has no keys at all.

### Type checking

`apilintType(element, type)` validates the element is of the given primitive type: `'object'`, `'string'`, `'number'`, `'boolean'`, or `'array'`.

`apilintNumber(element, integer?, positive?, includesZero?)` validates numeric constraints. When `integer` is true, the value must be a whole number. When `positive` is true with `includesZero`, the value must be >= 0; without `includesZero`, it must be > 0.

`apilintArray(element)` validates the element's value is an array.

`apilintArrayNotEmpty(element)` validates the element is a non-empty array.

### Value validation

`apilintValueOrArray(element, values[], unique?)` validates the element's value (or each element in an array value) is one of the allowed values. When `unique` is true, array values must also be unique.

`apilintContainsValue(element, value)` validates the element's value equals the given value, or if the element is an array, that it contains the value.

`apilintUniqueArray(element)` validates the element is an array with no duplicate values.

`apilintFieldValueOrArray(element, key, values[])` validates a specific field's value (or array of values) against an allowed list.

### Pattern matching

`apilintValueRegex(element, regexString, elementType?)` validates the element's value matches the given regular expression. Optionally also validates the element type.

`apilintKeyRegex(element, regexString)` validates the element's parent key matches the given regular expression.

`apilintFieldValueRegex(element, key, regexString)` validates a specific field's value matches the given regular expression.

`apilintKeysRegex(element, regexString)` validates all keys of an object element match the given regular expression.

`apilintMembersKeysRegex(element, regexString)` validates the keys of all direct child objects match the given regular expression.

### Structural validation

`allowedFields(element, keys[], allowExtensionPrefix?)` validates the object only contains keys from the allowed list. When `allowExtensionPrefix` is set (typically `'x-'`), keys with that prefix are also allowed.

`apilintElementOrClass(element, elementsOrClasses[])` validates the element's type or class is one of the specified values.

`apilintArrayOfElementsOrClasses(element, elementsOrClasses[], nonEmpty?)` validates the element is an array whose items all match the specified element types or classes.

`apilintChildrenOfElementsOrClasses(element, elementsOrClasses[])` validates all children of an object element match the specified types or classes.

`apilintArrayOfType(element, type, nonEmpty?)` validates the element is an array whose items are all of the specified primitive type.

`apilintChildrenOfType(element, type, nonEmpty?)` validates all children of an object element are of the specified primitive type.

`apilintNoDuplicateKeys(element)` validates the object has no duplicate keys.

### Casing

`apilintValueCasing(element, casingStyle, noNumbers?, separatorChar?, separatorAsFirstChar?)` validates the element's value follows the specified casing style.

`apilintKeyCasing(element, casingStyle, noNumbers?, separatorChar?, separatorAsFirstChar?)` validates the element's parent key follows the specified casing style.

`apilintFieldsKeysCasing(element, casingStyle, noNumbers?, separatorChar?, separatorAsFirstChar?)` validates all keys of an object follow the specified casing style.

`apilintFieldsValuesCasing(element, casingStyle, noNumbers?, separatorChar?, separatorAsFirstChar?)` validates all values of an object follow the specified casing style.

Supported casing styles are: `'camel'`, `'cobol'`, `'flat'`, `'kebab'`, `'macro'`, `'pascal'`, `'snake'`.

### URI and format

`apilintValidURI(element, absolute?)` validates the element's value is a valid URI. When `absolute` is true, the URI must be absolute (no relative resolution).

`apilintKeyIsRegex(element)` validates the element's parent key is a valid regular expression.

`apilintChildrenKeysAreRegex(element)` validates that all child member keys of an ObjectElement are valid regular expressions. Used by the `patternProperties` key validation rule.

### Constraints

`apilintMaxLength(element, maxLength)` validates a string element's length is at most `maxLength`.

`apilintMaximum(element, maximum)` validates a number element's value is at most `maximum`.

`apilintMinimum(element, minimum)` validates a number element's value is at most `minimum`.

### Relational

`apilintKeysIncluded(element, path)` validates all keys (or array values) of the element are included in the keys of the element found by navigating the given path.

`apilintElementKeysIncluded(element, elementOrClass)` validates all keys (or array values) of the element are included in the keys of all elements matching the given type or class across the entire API.

`apilintIncludedInArray(element, path, arrayMustExist)` validates the element's value is included in the array found by navigating the given path.

`apilintPropertyUniqueValue(element, elementOrClasses[], key)` validates the element's value is unique across all elements of the specified types or classes for the specified key.

### OpenAPI-specific

`apilintDiscriminator(element)` validates the discriminator value is a string and is included in the parent schema's `required` array.

`apilintRequiredDefinedInProperties(element)` validates all values in a `required` array correspond to keys in the sibling `properties` object.

`apilintOperationRequestBodyAllowed(element, allowedHttpMethods[])` validates the request body appears only on operations with allowed HTTP methods.

`apilintChannelParameterExist(element)` (AsyncAPI) validates channel parameters correspond to template expressions in the channel name.

`apilintOpenAPIPathTemplateWellFormed(element, strict?)` validates an OpenAPI path template is syntactically well-formed.

`apilintOpenAPIPathTemplateValid(element)` validates an OpenAPI path template has all its template expressions covered by path parameters.

`apilintOpenAPIParameterInPathTemplate(element)` validates a path parameter's name appears as a template expression in the corresponding path template.

### Arazzo-specific

`apilintChildrenOfTypeOrElementClass(element, type, elementsOrClasses[], nonEmpty?)` validates all children of an object element are either of the given primitive type or match one of the given element types/classes. Used for `outputs` maps from Arazzo 1.1 onward, where a value may be a Runtime Expression string or a Selector Object.

`apilintArazzoRuntimeExpression(element)` validates a string element is a syntactically valid [Arazzo Runtime Expression](https://spec.openapis.org/arazzo/latest.html#runtime-expressions), via `@swaggerexpert/arazzo-runtime-expression`.

`apilintObjectValuesArazzoRuntimeExpression(element)` validates every string value in an object map is a valid Runtime Expression. Non-string values are skipped, not flagged.

`apilintArazzoValueRuntimeExpression(element)` validates a string element is a valid Runtime Expression, but only when it starts with `$` (used for fields, like Parameter `value`, that mix literal values with expressions).

`apilintArazzoArrayValuesResolveToWorkflows(element)` validates each string in an array (`Workflow.dependsOn`) resolves to an existing `workflowId` in the current document. A `$sourceDescriptions.`-prefixed entry (external reference) is validated as a Runtime Expression instead, since its target can't be resolved locally.

`apilintArazzoStepDependsOnResolved(element)` — the `Step.dependsOn` equivalent. Expects `element` to be the step object itself (no `target` set on the rule), since resolving a plain entry requires the step's *own* workflow's sibling steps (`stepId` is workflow-scoped, unlike `workflowId`). A `$workflows.<workflowId>.steps.<stepId>` entry is resolved against the document's own workflows/steps (parsed via the `WorkflowsStepsExpression` AST node from `@swaggerexpert/arazzo-runtime-expression` >=3.2.0); a `$sourceDescriptions.<name>.<workflowId>.steps.<stepId>` entry is only shape-validated (its optional `stepsReference` AST field), since it points at an external document.

`apilintArazzoWorkflowIdResolved(element)` validates a single `workflowId` reference resolves to an existing workflow, with the same `$sourceDescriptions.` external-reference handling as above.

`apilintArazzoSourceDescriptionTypeConsistency(element, expectedTypes[])` cross-checks a `$sourceDescriptions.<name>.<reference>` value against the named source's declared `type` (e.g. a `workflowId` reference should point at `type: arazzo`, not `type: openapi`). Since `type` is optional on a Source Description Object, the check is silently skipped when it's absent or the named source isn't found - it never guesses.

`apilintArazzoArraySourceDescriptionTypeConsistency(element, expectedTypes[])` is the array form of the above, applied to each `$sourceDescriptions.`-prefixed entry (used for `dependsOn`).

`apilintArazzoActionStepIdResolved(element)` validates a success/failure action's `stepId` resolves to an existing step within the same workflow.

`apilintArazzoContentTypeFormat(element)` validates a `contentType` value looks like a MIME type (`type/subtype`, with optional parameters).

`apilintArazzoConditionRegexValid(element)` validates a Criterion `condition` is a syntactically valid regular expression, but only when the sibling `type` field is `'regex'` (or an Expression Type Object with `type: 'regex'`).

### Completion helpers

Some functions in `linter-functions.ts` are completion helpers rather than validators:

`apicompleteDiscriminator(element)` returns completion items for discriminator values from the `required` array.

`apicompleteRequired(element)` returns completion items for `required` array from sibling `properties` keys.

`apicompleteSecurity(element)` returns completion items for security requirements from defined security schemes.

`apicompleteChannelServers(element)` returns completion items for channel servers from defined servers.

## Rule organization in config/

Built-in rules are organized in a directory hierarchy under `packages/api-languageservice/src/config/` that mirrors the API specification structure:

```
config/
  config.ts                          # Root aggregator, builds the full Metadata object
  codes.ts                           # ApilintCodes enum with all error codes
  target-specs.ts                    # Shared target spec constants
  openapi/
    config.ts                        # Aggregates all OpenAPI element metas into MetadataMap
    target-specs.ts                  # OpenAPI-specific target spec constants
    server/
      meta.ts                        # FormatMeta: { lint, completion, documentation }
      lint/
        index.ts                     # Exports array of all server lint rules
        url--required.ts             # Individual rule file
        url--format-uri.ts
        description--type.ts
        variables--values-type.ts
        allowed-fields.ts
      completion.ts
      documentation.ts
    operation/                       # Same structure for each element type
      ...
  asyncapi/
    config.ts
    target-specs.ts
    server/
      ...
  arazzo/
    config.ts
    target-specs.ts                  # Arazzo10, Arazzo10X, Arazzo11, Arazzo11X, etc.
    step/
      lint/
        allowed-fields-1-0.ts        # Version-split rule: Arazzo 1.0.x field list
        allowed-fields-1-1.ts        # Version-split rule: Arazzo 1.1+ field list (superset)
        ...
    selector/                        # New in Arazzo 1.1 (no "required" rules - apidom only
      ...                            # recognizes the element once all fields are present)
  common/
    schema/                          # Shared schema rules reused across specs
      ...
  json-schema/
    2020-12/                         # JSON Schema 2020-12 rules
      ...
```

Each element type (server, operation, parameter, etc.) has its own directory containing a `meta.ts` file that bundles lint rules, completion items, and documentation. The lint rules for that element are collected in a `lint/index.ts` file that imports and exports all individual rule files.

The naming convention for rule files describes the field and check being performed. For example, `url--required.ts` validates the `url` field is required, `description--type.ts` validates the `description` field's type, and `allowed-fields.ts` validates no extra fields are present.

When a check's correct behavior differs across spec versions within the same namespace (a field is new, an enum grows, a pattern changes), split the rule into separate `-1-0.ts`/`-1-1.ts` (etc.) files rather than writing one version-agnostic file - each variant gets its own `targetSpecs` (e.g. `Arazzo10`, `Arazzo11`) but can reuse the same `ApilintCodes` entry, since it's the same logical check. See `config/arazzo/step/lint/allowed-fields-1-0.ts` / `allowed-fields-1-1.ts`, or `config/arazzo/sourceDescription/lint/type--equals-1-0.ts` / `type--equals-1-1.ts`, for examples. A rule with no version-specific behavior stays a single file with the broadest applicable `targetSpecs` (e.g. `Arazzo`, which spans every Arazzo version).

This file-per-version-line convention is a workaround, not a first-class per-field version-condition mechanism in the rules engine itself - there's no built-in way to express "this one field within a rule behaves differently by version" other than duplicating the whole `LinterMeta` object with a narrower `targetSpecs`. It scales fine to two lines (`-1-0.ts`/`-1-1.ts`), and a genuine three-way split (e.g. a hypothetical 1.2 introducing yet another variant of the same check) follows the same pattern - add a `-1-2.ts` file with its own `targetSpecs` (e.g. `Arazzo12`), and narrow whichever existing file(s) no longer apply to 1.2. If a check's version-conditional logic gets complex enough that this starts producing many near-duplicate files, that's a signal the rules engine itself may need an actual per-version-branch primitive rather than more file-splitting.

The `'*'` key in the namespace config applies rules to all element types within that namespace. The built-in wildcard rule checks for duplicate keys in all objects.

## Rule examples

### Required field

This rule validates that every OpenAPI Server object has a `url` field:

```typescript
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import ApilintCodes from '../../../codes.ts';
import { LinterMeta } from '../../../../apidom-language-types.ts';
import { OpenAPI3 } from '../../target-specs.ts';

const urlRequiredLint: LinterMeta = {
  code: ApilintCodes.OPENAPI3_O_SERVER_FIELD_URL_REQUIRED,
  source: 'apilint',
  message: "should always have a 'url'",
  severity: DiagnosticSeverity.Error,
  linterFunction: 'hasRequiredField',
  linterParams: ['url'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'url' field",
        action: 'addChild',
        snippetYaml: 'url: \n  ',
        snippetJson: '"url": "",\n    ',
      },
    ],
  },
  targetSpecs: OpenAPI3,
};

export default urlRequiredLint;
```

The rule uses `hasRequiredField` with `'url'` as a parameter. When the field is missing, the diagnostic highlights the object key and offers a quick fix to insert the field.

### Conditional URI format

This rule validates the `url` field is a valid URI, but only when it doesn't contain variable placeholders like `{host}`:

```typescript
const urlFormatURILint: LinterMeta = {
  code: ApilintCodes.OPENAPI3_O_SERVER_FIELD_URL_FORMAT_URI,
  source: 'apilint',
  message: 'url MUST be in the format of an URL.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'apilintValidURI',
  marker: 'value',
  target: 'url',
  data: {},
  conditions: [
    {
      targets: [{ path: 'url' }],
      function: 'apilintValueRegex',
      params: ['^(?!.*\\{\\S+?\\}).*$'],
    },
  ],
  targetSpecs: OpenAPI3,
};
```

The condition navigates to the `url` child element and checks it doesn't contain `{...}` patterns. Only if that condition passes does the rule then validate the URL format.

### Mutual exclusivity

This rule enforces that `value` and `externalValue` cannot coexist on an OpenAPI Example object:

```typescript
const valueMutuallyExclusiveLint: LinterMeta = {
  code: ApilintCodes.OPENAPI3_0_EXAMPLE_FIELD_VALUE_MUTUALLY_EXCLUSIVE,
  source: 'apilint',
  message: 'The value field and externalValue field are mutually exclusive.',
  severity: DiagnosticSeverity.Error,
  linterFunction: 'missingFields',
  linterParams: [['value']],
  marker: 'key',
  markerTarget: 'value',
  conditions: [
    {
      function: 'existFields',
      params: [['externalValue']],
    },
  ],
  targetSpecs: OpenAPI3,
};
```

The condition checks whether `externalValue` exists. If it does, the rule then checks that `value` is missing. The `markerTarget` ensures the diagnostic highlights the `value` field specifically.

## Custom rules

Custom rules can be added at runtime by extending the metadata object before passing it to the language service. There are two approaches depending on how you want to target elements.

### Semantic (element-level) custom rules

To add a rule that applies to a specific ApiDOM element type, push it into the appropriate entry in `metadataMaps`:

```typescript
import { config } from '@speclynx/api-languageservice/config/config';
import { LinterMeta, Metadata } from '@speclynx/api-languageservice';
import { deepCopyMetadata } from '@speclynx/api-languageservice/utils/utils';

const customConfig = deepCopyMetadata(config() as Metadata);

const camelCaseProperties: LinterMeta = {
  name: 'SB-API-050-property-names',
  description: 'property names must be camelCase and alphanumeric',
  code: 20001,
  source: 'apilint',
  message: 'properties MUST follow camelCase',
  severity: 1,
  linterFunction: 'apilintKeyCasing',
  linterParams: ['camel'],
  marker: 'key',
  conditions: [
    {
      targets: [{ path: 'parent' }],
      function: 'apilintElementOrClass',
      params: [['json-schema-properties']],
    },
  ],
  data: {},
};

// Add to schema rules
customConfig.metadataMaps.openapi?.schema?.lint?.push(camelCaseProperties);
```

### Namespace-level custom rules with given

For rules that should apply across multiple element types or use JSONPath selection, use the `metadata.rules` property with a `given` field:

```typescript
// Semantic given: matches by ApiDOM element name
const parameterCasing: LinterMeta = {
  name: 'SB-API-050-query-parameter-names',
  given: ['parameter'],                       // Matches all 'parameter' elements
  givenFormat: LinterGivenFormat.SEMANTIC,     // Optional, SEMANTIC is the default
  code: 20002,
  source: 'apilint',
  message: 'parameter names MUST follow camelCase',
  severity: 1,
  linterFunction: 'apilintValueCasing',
  linterParams: ['camel'],
  target: 'name',
  marker: 'key',
  conditions: [
    {
      targets: [{ path: 'in' }],
      function: 'apilintValueOrArray',
      params: [['query']],
    },
  ],
  data: {},
};

customConfig.rules = {
  openapi: {
    lint: [parameterCasing],
  },
};
```

### JSONPath-based custom rules

JSONPath rules use `givenFormat: LinterGivenFormat.JSONPATH` and provide JSONPath expressions in the `given` field. The engine evaluates these expressions against the API root and applies the rule to each matched element:

```typescript
const schemaCasing: LinterMeta = {
  name: 'SB-API-050-schema-keys',
  given: ['$.components.schemas.*.properties.*', '$.components.parameters.*'],
  givenFormat: LinterGivenFormat.JSONPATH,
  code: 20001,
  source: 'apilint',
  message: 'keys MUST follow camelCase',
  severity: 1,
  linterFunction: 'apilintKeyCasing',
  linterParams: ['camel'],
  marker: 'key',
  data: {},
};

customConfig.rules = {
  openapi: {
    lint: [schemaCasing],
  },
};
```

### Custom linter functions

You can also register custom linter functions that rules (including conditions) can reference by name:

```typescript
customConfig.linterFunctions = {
  openapi: {
    myCustomCheck: (element: Element, param1: string): boolean => {
      // Custom validation logic
      return true;
    },
  },
};
```

These functions follow the same contract as standard functions: the first argument is the target element, subsequent arguments come from `linterParams`, and the return value is a boolean where `true` means the check passes.

## Testing rules

Validation rules are tested through the language service's `doValidation` method. The test setup creates a `LanguageServiceContext` with the desired metadata and validation providers, then validates fixture documents and asserts the expected diagnostics.

Here is the typical test pattern used in `packages/api-languageservice/test/`:

```typescript
import getLanguageService from '../src/apidom-language-service.ts';
import { LanguageServiceContext, ValidationContext } from '../src/apidom-language-types.ts';
import { metadata } from './metadata.ts';

const context: LanguageServiceContext = {
  metadata: metadata(),
  validatorProviders: [
    // Optional JSON Schema validation providers
  ],
  validationContext: {
    semanticValidation: true,
    semanticLinting: true,
    referenceValidation: true,
    jsonSchemaValidation: false,
  },
};

const languageService = getLanguageService(context);

// Create a TextDocument from fixture content
const textDocument = TextDocument.create('foo://bar/spec.json', 'json', 0, specContent);

// Run validation
const diagnostics = await languageService.doValidation(textDocument);

// Assert expected results
assert.deepEqual(diagnostics[0].message, "should always have a 'url'");
assert.equal(diagnostics[0].severity, DiagnosticSeverity.Error);
```

Test fixtures are stored in `packages/api-languageservice/test/fixtures/` as JSON and YAML files. Custom rule tests (e.g., `test/custom-metadata.ts`, `test/custom-metadata-jsonpath.ts`) demonstrate how to extend the default metadata with additional rules and validate they produce the expected diagnostics.

To run the tests:

```bash
source ~/.nvm/nvm.sh && nvm use
npm run build:es
npm test
```

## Adding a new built-in rule

To add a new built-in rule to the codebase:

1. Determine which element type the rule applies to and find its directory under `packages/api-languageservice/src/config/{namespace}/{element}/lint/`.

2. Add an error code to `packages/api-languageservice/src/config/codes.ts` in the appropriate enum range.

3. Create a new file following the naming convention `{field}--{check}.ts` (e.g., `description--required.ts`, `name--type.ts`, `allowed-fields-3-1.ts`).

4. Define the `LinterMeta` object with all required fields: `code`, `source` (`'apilint'`), `message`, `severity`, `linterFunction`, `marker`, and `targetSpecs`.

5. Import the new rule in the element's `lint/index.ts` and add it to the exported array.

6. Add or update test fixtures and assertions in the appropriate test file under `packages/api-languageservice/test/`.

7. Build and run tests to verify:
   ```bash
   source ~/.nvm/nvm.sh && nvm use
   npm run build:es && npm test
   ```
