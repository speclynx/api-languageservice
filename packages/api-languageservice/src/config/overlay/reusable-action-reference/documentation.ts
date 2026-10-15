import { Overlay12 } from '../target-specs.ts';

const documentation = [
  {
    target: '$ref',
    docs: '**REQUIRED** A [same-document](https://www.rfc-editor.org/rfc/rfc3986.html#section-4.4) (or fragment-only) relative URI reference, per RFC3986 §4.4, where the fragment syntax is JSON Pointer with the pointer prefix restricted to `/components/actions/`. Component action keys in this pointer MUST be encoded according to [RFC6901, Section 3](https://www.rfc-editor.org/rfc/rfc6901#section-3).',
    targetSpecs: Overlay12,
  },
  {
    target: 'target',
    docs: '**REQUIRED** A JSONPath query expression, as described in [RFC9535](https://www.rfc-editor.org/rfc/rfc9535), referencing the target objects in the source document.',
    targetSpecs: Overlay12,
  },
  {
    target: 'description',
    docs: 'A description of the action. [CommonMark](https://spec.commonmark.org/) syntax MAY be used for rich text representation.\n\nIn case a description is defined in `fields` of the referenced [Reusable Action Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-object) and in the [Reusable Action Reference Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-reference-object), the description from the Reusable Action Reference Object MUST be used.',
    targetSpecs: Overlay12,
  },
  {
    docs: '#### [Reusable Action Reference Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-reference-object)\n\nA Reusable Action Reference Object applies a reusable action defined in `components.actions` to a specific target in the source document.\nIt references the reusable action by `$ref` and MAY provide action fields that override values from the referenced reusable action for that use.\n\n##### Fixed Fields\n\nField Name | Type | Description\n---|:---:|---\n$ref | `string` | **REQUIRED** A [same-document](https://www.rfc-editor.org/rfc/rfc3986.html#section-4.4) (or fragment-only) relative URI reference, per RFC3986 §4.4, where the fragment syntax is JSON Pointer with the pointer prefix restricted to `/components/actions/`. Component action keys in this pointer MUST be encoded according to [RFC6901, Section 3](https://www.rfc-editor.org/rfc/rfc6901#section-3).\ntarget | `string` | **REQUIRED** A JSONPath query expression, as described in [RFC9535](https://www.rfc-editor.org/rfc/rfc9535), referencing the target objects in the source document.\ndescription | `string` | A description of the action. [CommonMark](https://spec.commonmark.org/) syntax MAY be used for rich text representation.\n\n\\\nThis object MAY be extended with [Specification Extensions](https://spec.openapis.org/overlay/v1.2.0.html#specification-extensions).\n\nIn case a description is defined in `fields` of the referenced [Reusable Action Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-object) and in the [Reusable Action Reference Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-reference-object), the description from the Reusable Action Reference Object MUST be used.\n\n##### Reusable Action Reference Object Example\n\n\n\\\nJSON\n```json\n{\n  "$ref": "#/components/actions/errorResponse",\n  "target": "$.paths[\'/items\'].get.responses"\n}\n```\n\n\n\\\nYAML\n```yaml\n$ref: \'#/components/actions/errorResponse\'\ntarget: "$.paths[\'/items\'].get.responses"\n```',
    targetSpecs: Overlay12,
  },
];

export default documentation;
