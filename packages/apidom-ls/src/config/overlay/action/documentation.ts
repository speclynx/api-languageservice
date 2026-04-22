import { Overlay11 } from '../target-specs.ts';

const documentation = [
  {
    target: 'target',
    docs: '**REQUIRED** A [RFC9535](https://www.rfc-editor.org/rfc/rfc9535) JSONPath query expression selecting nodes in the target document.',
    targetSpecs: Overlay11,
  },
  {
    target: 'description',
    docs: 'A description of the action. [CommonMark](https://spec.commonmark.org/) syntax MAY be used for rich text representation.',
    targetSpecs: Overlay11,
  },
  {
    target: 'update',
    docs: 'Any\n\\\n\\\nIf the `target` selects object nodes, the value of this field MUST be an object with the properties and values to merge with each selected object. If the `target` selects array nodes, the value of this field MUST be an array to concatenate with each selected array, or an object or primitive value to append to each selected array. If the `target` selects primitive nodes, the value of this field MUST be a primitive value to replace each selected node. This field has no impact if the `remove` field of this action object is `true` or if the `copy` field contains a value.',
    targetSpecs: Overlay11,
  },
  {
    target: 'copy',
    docs: 'A JSONPath expression selecting a single node to copy into the `target` nodes. If the `target` selects object nodes, the value of this field MUST be an object with the properties and values to merge with each selected object. If the `target` selects array nodes, the value of this field MUST be an array to concatenate with each selected array, or an object or primitive value to append to each selected array. If the `target` selects primitive nodes, the value of this field MUST be a primitive value to replace each selected node. This field has no impact if the `remove` field of this action object is `true` or if the `update` field contains a value.',
    targetSpecs: Overlay11,
  },
  {
    target: 'remove',
    docs: '`boolean`\n\\\n\\\nA boolean value that indicates that each of the target nodes MUST be removed from the map or array it is contained in. The default value is `false`.',
    targetSpecs: Overlay11,
  },
  {
    docs: '#### [Action Object](https://spec.openapis.org/overlay/v1.1.0.html#action-object)\n\nThis object represents one or more changes to be applied to the target document at the locations defined by the target JSONPath expression.\n\n##### Fixed Fields\n\nField Name | Type | Description\n---|:---:|---\ntarget | `string` | **REQUIRED** A RFC9535 JSONPath query expression selecting nodes in the target document.\ndescription | `string` | A description of the action. [CommonMark](https://spec.commonmark.org/) syntax MAY be used for rich text representation.\nupdate | Any | If the `target` selects object nodes, the value of this field MUST be an object with the properties and values to merge with each selected object. If the `target` selects array nodes, the value of this field MUST be an array to concatenate with each selected array, or an object or primitive value to append to each selected array. If the `target` selects primitive nodes, the value of this field MUST be a primitive value to replace each selected node. This field has no impact if the `remove` field of this action object is `true` or if the `copy` field contains a value.\ncopy | `string` | A JSONPath expression selecting a single node to copy into the `target` nodes. If the `target` selects object nodes, the value of this field MUST be an object with the properties and values to merge with each selected object. If the `target` selects array nodes, the value of this field MUST be an array to concatenate with each selected array, or an object or primitive value to append to each selected array. If the `target` selects primitive nodes, the value of this field MUST be a primitive value to replace each selected node. This field has no impact if the `remove` field of this action object is `true` or if the `update` field contains a value.\nremove | `boolean` | A boolean value that indicates that each of the target nodes MUST be removed from the map or array it is contained in. The default value is `false`.\n\nIf the `target` JSONPath expression selects zero nodes, the action succeeds without changing the target document.\nIf the `target` JSONPath expression selects two or more nodes for an `update` or `copy` action, the selected nodes MUST be either all objects or all arrays or all primitives.\n\nThe properties of the `update` or `copy` object MUST be compatible with the target object referenced by the JSONPath key. When the Overlay document is applied, the `update` or `copy` object is merged with the target object by recursively applying these steps:\n\n- A property that only exists in the target object is left unchanged.\n- A property that only exists in the `update` or `copy` object is inserted into the target object.\n- If a property exists in both `update` or `copy` and target object:\n  - A primitive value of the `update` or `copy` property replaces a primitive value of the target property.\n  - An array value of the `update` or `copy` property is concatenated with an array value of the target property.\n  - An object value of the `update` or `copy` property is recursively merged with an object value of the target property.\n  - Other property value combinations are incompatible and result in an error.\n\n\\\nThis object MAY be extended with [Specification Extensions](https://spec.openapis.org/overlay/v1.1.0.html#specification-extensions).\n\n##### Action Object Example\n\n\n\\\nJSON\n```json\n{\n  "target": "$.info",\n  "update": {\n    "description": "This is the updated description",\n    "x-overlay-applied": "targeted-overlay"\n  }\n}\n```\n\n\n\\\nYAML\n```yaml\ntarget: $.info\nupdate:\n  description: This is the updated description\n  x-overlay-applied: targeted-overlay\n```',
    targetSpecs: Overlay11,
  },
];

export default documentation;
