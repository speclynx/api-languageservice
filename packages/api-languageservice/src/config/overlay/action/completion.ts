import {
  ApidomCompletionItem,
  CompletionFormat,
  CompletionType,
} from '../../../apidom-language-types.ts';
import { Overlay1, Overlay10, Overlay11, Overlay12 } from '../target-specs.ts';

const completion: ApidomCompletionItem[] = [
  {
    label: 'target',
    insertText: 'target',
    kind: 14,
    format: CompletionFormat.QUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '**REQUIRED** A [RFC9535](https://www.rfc-editor.org/rfc/rfc9535) JSONPath query expression selecting nodes in the target document.',
    },
    conditions: [
      {
        targets: [{ path: 'parent' }],
        function: 'apilintElementOrClass',
        params: [['reusableAction']],
        negate: true,
      },
    ],
    targetSpecs: [...Overlay11, ...Overlay12],
  },
  {
    label: '$ref',
    insertText: '\\$ref',
    kind: 14,
    format: CompletionFormat.QUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '**REQUIRED** A [same-document](https://www.rfc-editor.org/rfc/rfc3986.html#section-4.4) (or fragment-only) relative URI reference, per RFC3986 §4.4, where the fragment syntax is JSON Pointer with the pointer prefix restricted to `/components/actions/`. Component action keys in this pointer MUST be encoded according to [RFC6901, Section 3](https://www.rfc-editor.org/rfc/rfc6901#section-3).',
    },
    // only a plain action can become a Reusable Action Reference: update/copy/remove
    // are not allowed next to $ref, and `fields` of a Reusable Action cannot be a reference
    conditions: [
      {
        targets: [{ path: 'parent' }],
        function: 'apilintElementOrClass',
        params: [['reusableAction']],
        negate: true,
      },
      {
        function: 'missingFields',
        params: [['update', 'copy', 'remove']],
      },
    ],
    targetSpecs: Overlay12,
  },
  {
    label: 'target',
    insertText: 'target',
    kind: 14,
    format: CompletionFormat.QUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value: '**REQUIRED** A JSONPath expression selecting nodes in the target document.',
    },
    targetSpecs: Overlay10,
  },
  {
    label: 'description',
    insertText: 'description',
    kind: 14,
    format: CompletionFormat.QUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        'A description of the action. [CommonMark](https://spec.commonmark.org/) syntax MAY be used for rich text representation.',
    },
    targetSpecs: Overlay1,
  },
  {
    label: 'update',
    insertText: 'update',
    kind: 14,
    format: CompletionFormat.OBJECT,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        'Any\n\\\n\\\nIf the `target` selects object nodes, the value of this field MUST be an object with the properties and values to merge with each selected object. If the `target` selects array nodes, the value of this field MUST be an array to concatenate with each selected array, or an object or primitive value to append to each selected array. If the `target` selects primitive nodes, the value of this field MUST be a primitive value to replace each selected node. This field has no impact if the `remove` field of this action object is `true` or if the `copy` field contains a value.',
    },
    targetSpecs: [...Overlay11, ...Overlay12],
  },
  {
    label: 'update',
    insertText: 'update',
    kind: 14,
    format: CompletionFormat.OBJECT,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        'Any\n\\\n\\\nIf the `target` selects an object node, the value of this field MUST be an object with the properties and values to merge with the selected node. If the `target` selects an array, the value of this field MUST be an entry to append to the array. This field has no impact if the `remove` field of this action object is `true`.',
    },
    targetSpecs: Overlay10,
  },
  {
    label: 'copy',
    insertText: 'copy',
    kind: 14,
    format: CompletionFormat.QUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        'A JSONPath expression selecting a single node to copy into the `target` nodes. If the `target` selects object nodes, the value of this field MUST be an object with the properties and values to merge with each selected object. If the `target` selects array nodes, the value of this field MUST be an array to concatenate with each selected array, or an object or primitive value to append to each selected array. If the `target` selects primitive nodes, the value of this field MUST be a primitive value to replace each selected node. This field has no impact if the `remove` field of this action object is `true` or if the `update` field contains a value.',
    },
    targetSpecs: [...Overlay11, ...Overlay12],
  },
  {
    label: 'remove',
    insertText: 'remove',
    kind: 14,
    format: CompletionFormat.UNQUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '`boolean`\n\\\n\\\nA boolean value that indicates that each of the target nodes MUST be removed from the map or array it is contained in. The default value is `false`.',
    },
    targetSpecs: [...Overlay11, ...Overlay12],
  },
  {
    label: 'remove',
    insertText: 'remove',
    kind: 14,
    format: CompletionFormat.UNQUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '`boolean`\n\\\n\\\nA boolean value that indicates that the target object or array MUST be removed from the map or array it is contained in. The default value is `false`.',
    },
    targetSpecs: Overlay10,
  },
  {
    target: 'remove',
    label: 'true',
    insertText: 'true',
    kind: 12,
    format: CompletionFormat.UNQUOTED,
    type: CompletionType.VALUE,
    insertTextFormat: 2,
    targetSpecs: Overlay1,
  },
  {
    target: 'remove',
    label: 'false',
    insertText: 'false',
    kind: 12,
    format: CompletionFormat.UNQUOTED,
    type: CompletionType.VALUE,
    insertTextFormat: 2,
    targetSpecs: Overlay1,
  },
];

export default completion;
