import { Overlay12 } from '../target-specs.ts';

/**
 * Omitted fixed fields:
 *  - fields
 *
 * Field omission reason: omitted fields do have a non-union type. Thus,
 * documentation for these fields doesn't need to be specified here and will
 * come directly from the type itself. Description of these fields doesn't
 * contain significant information.
 */

const documentation = [
  {
    target: 'description',
    docs: 'A description of the reusable action. This description is independent of the `description` field on the contained [Action Object](https://spec.openapis.org/overlay/v1.2.0.html#action-object) and is intended to document the reusable action itself (for example, its purpose or usage). [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.',
    // Reusable Action References carry `referenced-element: reusableAction`; their own
    // `description` documentation must win, as the reference description takes precedence
    conditions: [
      {
        function: 'apilintElementOrClass',
        params: [['reusableActionReference']],
        negate: true,
      },
    ],
    targetSpecs: Overlay12,
  },
  {
    docs: '#### [Reusable Action Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-object)\n\nThis object defines a reusable action in [`components.actions`](https://spec.openapis.org/overlay/v1.2.0.html#component-actions).\nIt can be referenced from [`actions`](https://spec.openapis.org/overlay/v1.2.0.html#overlay-actions) by a [Reusable Action Reference Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-reference-object).\n\n##### Fixed Fields\n\nField Name | Type | Description\n---|:---:|---\ndescription | `string` | A description of the reusable action. This description is independent of the `description` field on the contained [Action Object](https://spec.openapis.org/overlay/v1.2.0.html#action-object) and is intended to document the reusable action itself (for example, its purpose or usage). [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.\nfields | [Action Object](https://spec.openapis.org/overlay/v1.2.0.html#action-object) | An [Action Object](https://spec.openapis.org/overlay/v1.2.0.html#action-object) where no field is required, except that the `target` field MUST NOT be provided. The `target` MUST be supplied by the [Reusable Action Reference Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-reference-object).\n\n\\\nThis object MAY be extended with [Specification Extensions](https://spec.openapis.org/overlay/v1.2.0.html#specification-extensions).\n\nA reusable action is similar to an action but differs in important ways:\n\n1. Action fields are nested inside the `fields` property, not defined as peer properties. The `fields` object may omit any action field, and MUST NOT include the `target` field; the `target` MUST be supplied by the [Reusable Action Reference Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-reference-object).\n1. A Reusable Action Object has to be referenced by a Reusable Action Reference Object to have any effect on the OpenAPI description.\n\n##### Reusable Action Object Example\n\n\n\\\nJSON\n```json\n{\n  "description": "Adds an error response to the operation",\n  "fields": {\n    "update": {\n      "404": {\n        "description": "Not Found"\n      }\n    }\n  }\n}\n```\n\n\n\\\nYAML\n```yaml\ndescription: Adds an error response to the operation\nfields:\n  update:\n    404:\n      description: Not Found\n```',
    targetSpecs: Overlay12,
  },
];

export default documentation;
