# Addon to Phase 4: Update JSON Shema testing to include JSON Schema 2020-12 relaed tests

This addon to phase 4 performed in `docs/arazzo-rules/phase4/schema.md` adds JSON Schema 2020-12 related tests to the JSON Schema testing.

The goal is to update or add the tests related to: "The Arazzo parser does not create typed Schema/JSONSchema elements for inline YAML objects within nested schema fields (e.g., objects under `items`, `contains`, `if`, `then`, `else`, `not`, `propertyNames`, `additionalItems`)." This means:

The Arazzo parser creaetes `JSONSCHEMA202012` elements for these fields and the rules have been updated accordingly to include it, so they should fire okay.


Additionally, verify and add tests for the second issue mentioned:

The `apilintKeyIsRegex` function for `patternProperties` keys does not fire because the parser does not create proper member elements within nested schema objects.
