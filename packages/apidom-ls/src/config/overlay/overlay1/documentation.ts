import { Overlay11 } from '../target-specs.ts';

/**
 * Omitted fixed fields:
 *  - info
 *
 * Field omission reason: omitted fields do have a non-union type. Thus,
 * documentation for these fields doesn't need to be specified here and will
 * come directly from the type itself. Description of these fields doesn't
 * contain significant information.
 */

const documentation = [
  {
    target: 'overlay',
    docs: '**REQUIRED**. This string MUST be the [version number](https://spec.openapis.org/overlay/v1.1.0.html#versions) of the Overlay Specification that the Overlay document uses. The `overlay` field SHOULD be used by tooling to interpret the Overlay document.',
    targetSpecs: Overlay11,
  },
  {
    target: 'extends',
    docs: 'URI reference that identifies the target document (such as an [OpenAPI](https://www.openapis.org/) document) this overlay applies to.',
    targetSpecs: Overlay11,
  },
  {
    target: 'actions',
    docs: '[[Action Object](https://spec.openapis.org/overlay/v1.1.0.html#action-object)]\n\\\n\\\n**REQUIRED** An ordered list of actions to be applied to the target document. The array MUST contain at least one value.\n\nThe list of actions MUST be applied in sequential order to ensure a consistent outcome. Actions are applied to the result of the previous action. This enables objects to be deleted in one action and then re-created in a subsequent action, for example.\n\n##### [Targeted Overlay Example](https://spec.openapis.org/overlay/v1.1.0.html#targeted-overlay-example)\n\n```yaml\nactions:\n  - target: $.paths[\'/foo\'].get.description\n    update: This is the new description\n  - target: $.paths[\'/bar\'].get.description\n    update: This is the updated description\n  - target: $.paths[\'/bar\']\n    update:\n      post:\n        description: This is an updated description of a child object\n        x-safe: false\n```\n\n##### [Wildcard Overlay Example](https://spec.openapis.org/overlay/v1.1.0.html#wildcard-overlay-example)\n\n```yaml\nactions:\n  - target: $.paths.*.get\n    update:\n      x-safe: true\n  - target: $.paths.*.get.parameters[?@.name==\'filter\' && @.in==\'query\']\n    update:\n      schema:\n        $ref: \'#/components/schemas/filterSchema\'\n```\n\n##### [Array Modification Examples](https://spec.openapis.org/overlay/v1.1.0.html#array-modification-examples)\n\n```yaml\nactions:\n  - target: $.paths.*.get.parameters\n    update:\n      name: newParam\n      in: query\n```\n\n```yaml\nactions:\n  - target: $.paths.*.get.parameters[?@.name == \'dummy\']\n    remove: true\n```\n\n##### [Copy Example](https://spec.openapis.org/overlay/v1.1.0.html#simple-copy)\n\n```yaml\nactions:\n  - target: \'$.paths["/some-items"]\'\n    copy: \'$.paths["/items"]\'\n    description: \'copies recursively all elements from the "items" path item to the new "some-items" path item\'\n```',
    targetSpecs: Overlay11,
  },
  {
    docs: '#### [Overlay Object](https://spec.openapis.org/overlay/v1.1.0.html#overlay-object)\n\nThis is the root object of the [Overlay](https://spec.openapis.org/overlay/v1.1.0.html#overlay).\n\n##### Fixed Fields\n\nField Name | Type | Description\n---|:---:|---\noverlay | `string` | **REQUIRED**. This string MUST be the [version number](https://spec.openapis.org/overlay/v1.1.0.html#versions) of the Overlay Specification that the Overlay document uses. The `overlay` field SHOULD be used by tooling to interpret the Overlay document.\ninfo | [Info Object](https://spec.openapis.org/overlay/v1.1.0.html#info-object) | **REQUIRED**. Provides metadata about the Overlay. The metadata MAY be used by tooling as required.\nextends | `string` | URI reference that identifies the target document (such as an [OpenAPI](https://www.openapis.org/) document) this overlay applies to.\nactions | [[Action Object](https://spec.openapis.org/overlay/v1.1.0.html#action-object)] | **REQUIRED** An ordered list of actions to be applied to the target document. The array MUST contain at least one value.\n\n\\\nThis object MAY be extended with [Specification Extensions](https://spec.openapis.org/overlay/v1.1.0.html#specification-extensions).\n\nThe list of actions MUST be applied in sequential order to ensure a consistent outcome. Actions are applied to the result of the previous action. This enables objects to be deleted in one action and then re-created in a subsequent action, for example.\n\nThe `extends` property can be used to indicate that the Overlay was designed to update a specific [OpenAPI](https://www.openapis.org/) document. Where no `extends` is provided it is the responsibility of tooling to apply the Overlay document to the appropriate OpenAPI document(s).\n\n##### Overlay Object Example\n\n\n\\\nJSON\n```json\n{\n  "overlay": "1.1.0",\n  "info": {\n    "title": "Targeted Overlay",\n    "version": "1.0.0"\n  },\n  "extends": "https://example.com/openapi.json",\n  "actions": [\n    {\n      "target": "$.info",\n      "update": {\n        "description": "This is the updated description",\n        "x-overlay-applied": "targeted-overlay"\n      }\n    },\n    {\n      "target": "$.info.title",\n      "update": "This is the updated title"\n    }\n  ]\n}\n```\n\n\n\\\nYAML\n```yaml\noverlay: 1.1.0\ninfo:\n  title: Targeted Overlay\n  version: 1.0.0\nextends: \'https://example.com/openapi.yaml\'\nactions:\n  - target: $.info\n    update:\n      description: This is the updated description\n      x-overlay-applied: targeted-overlay\n  - target: $.info.title\n    update: This is the updated title\n```',
    targetSpecs: Overlay11,
  },
];

export default documentation;
