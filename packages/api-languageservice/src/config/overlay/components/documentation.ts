import { Overlay12 } from '../target-specs.ts';

const documentation = [
  {
    target: 'actions',
    docs: 'Map[`string`, [Reusable Action Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-object)]\n\\\n\\\nA key-value set of reusable actions to reference in the actions through a [Reusable Action Reference Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-reference-object).\n\nWhen a key under `components.actions` is referenced by a Reusable Action Reference Object, that key is part of a JSON Pointer token and MUST be encoded according to [RFC6901, Section 3](https://www.rfc-editor.org/rfc/rfc6901#section-3) (for example, `~` as `~0` and `/` as `~1`).',
    targetSpecs: Overlay12,
  },
  {
    docs: '#### [Components Object](https://spec.openapis.org/overlay/v1.2.0.html#components-object)\n\nThe object provides a set of components to be reused across the Overlay document.\n\n##### Fixed Fields\n\nField Name | Type | Description\n---|:---:|---\nactions | Map[`string`, [Reusable Action Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-object)] | A key-value set of reusable actions to reference in the actions through a [Reusable Action Reference Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-reference-object).\n\n\\\nThis object MAY be extended with [Specification Extensions](https://spec.openapis.org/overlay/v1.2.0.html#specification-extensions).\n\nWhen a key under `components.actions` is referenced by a Reusable Action Reference Object, that key is part of a JSON Pointer token and MUST be encoded according to [RFC6901, Section 3](https://www.rfc-editor.org/rfc/rfc6901#section-3) (for example, `~` as `~0` and `/` as `~1`).\n\n##### Components Object Example\n\n\n\\\nJSON\n```json\n{\n  "actions": {\n    "errorResponse": {\n      "description": "Adds an error response to the operation",\n      "fields": {\n        "update": {\n          "404": {\n            "description": "Not Found"\n          }\n        }\n      }\n    }\n  }\n}\n```\n\n\n\\\nYAML\n```yaml\nactions:\n  errorResponse:\n    description: Adds an error response to the operation\n    fields:\n      update:\n        404:\n          description: Not Found\n```',
    targetSpecs: Overlay12,
  },
];

export default documentation;
