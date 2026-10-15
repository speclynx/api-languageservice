import {
  ApidomCompletionItem,
  CompletionFormat,
  CompletionType,
} from '../../../apidom-language-types.ts';
import { Overlay1, Overlay10, Overlay11, Overlay12 } from '../target-specs.ts';

const completion: ApidomCompletionItem[] = [
  {
    label: 'overlay',
    insertText: 'overlay',
    kind: 14,
    format: CompletionFormat.QUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '**REQUIRED**. This string MUST be the [version number](https://spec.openapis.org/overlay/v1.0.0.html#versions) of the Overlay Specification that the Overlay document uses. The `overlay` field SHOULD be used by tooling to interpret the Overlay document.',
    },
    targetSpecs: Overlay10,
  },
  {
    label: 'overlay',
    insertText: 'overlay',
    kind: 14,
    format: CompletionFormat.QUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '**REQUIRED**. This string MUST be the [version number](https://spec.openapis.org/overlay/v1.1.0.html#versions) of the Overlay Specification that the Overlay document uses. The `overlay` field SHOULD be used by tooling to interpret the Overlay document.',
    },
    targetSpecs: Overlay11,
  },
  {
    label: 'overlay',
    insertText: 'overlay',
    kind: 14,
    format: CompletionFormat.QUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '**REQUIRED**. This string MUST be the [version number](https://spec.openapis.org/overlay/v1.2.0.html#versions) of the Overlay Specification that the Overlay document uses. The `overlay` field SHOULD be used by tooling to interpret the Overlay document.',
    },
    targetSpecs: Overlay12,
  },
  {
    label: '$self',
    insertText: '\\$self',
    kind: 14,
    format: CompletionFormat.QUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        'A URI-reference for the Overlay document. This string MUST be in the form of a URI-reference as defined by [RFC3986 Section 4.1](https://tools.ietf.org/html/rfc3986#section-4.1). When present, this field provides the self-assigned URI of this Overlay document, which also serves as its base URI in accordance with [RFC3986 Section 5.1.1](https://tools.ietf.org/html/rfc3986#section-5.1.1) for resolving relative references within this document. The `$self` URI MUST NOT contain a fragment identifier. Overlay documents MAY include a `$self` field to ensure portable, unambiguous reference resolution.',
    },
    targetSpecs: Overlay12,
  },
  {
    label: 'info',
    insertText: 'info',
    kind: 14,
    format: CompletionFormat.OBJECT,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '[Info Object](https://spec.openapis.org/overlay/v1.0.0.html#info-object)\n\\\n\\\n**REQUIRED**. Provides metadata about the Overlay. The metadata MAY be used by tooling as required.',
    },
    targetSpecs: Overlay10,
  },
  {
    label: 'info',
    insertText: 'info',
    kind: 14,
    format: CompletionFormat.OBJECT,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '[Info Object](https://spec.openapis.org/overlay/v1.1.0.html#info-object)\n\\\n\\\n**REQUIRED**. Provides metadata about the Overlay. The metadata MAY be used by tooling as required.',
    },
    targetSpecs: Overlay11,
  },
  {
    label: 'info',
    insertText: 'info',
    kind: 14,
    format: CompletionFormat.OBJECT,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '[Info Object](https://spec.openapis.org/overlay/v1.2.0.html#info-object)\n\\\n\\\n**REQUIRED**. Provides metadata about the Overlay. The metadata MAY be used by tooling as required.',
    },
    targetSpecs: Overlay12,
  },
  {
    label: 'extends',
    insertText: 'extends',
    kind: 14,
    format: CompletionFormat.QUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        'URI reference that identifies the target document (such as an [OpenAPI](https://www.openapis.org/) document) this overlay applies to.',
    },
    targetSpecs: Overlay1,
  },
  {
    label: 'actions',
    insertText: 'actions',
    kind: 14,
    format: CompletionFormat.ARRAY,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '[[Action Object](https://spec.openapis.org/overlay/v1.0.0.html#action-object)]\n\\\n\\\n**REQUIRED** An ordered list of actions to be applied to the target document. The array MUST contain at least one value.',
    },
    targetSpecs: Overlay10,
  },
  {
    label: 'actions',
    insertText: 'actions',
    kind: 14,
    format: CompletionFormat.ARRAY,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '[[Action Object](https://spec.openapis.org/overlay/v1.1.0.html#action-object)]\n\\\n\\\n**REQUIRED** An ordered list of actions to be applied to the target document. The array MUST contain at least one value.',
    },
    targetSpecs: Overlay11,
  },
  {
    label: 'actions',
    insertText: 'actions',
    kind: 14,
    format: CompletionFormat.ARRAY,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '[[Action Object](https://spec.openapis.org/overlay/v1.2.0.html#action-object) \\| [Reusable Action Reference Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-reference-object)]\n\\\n\\\n**REQUIRED** An ordered list of actions to be applied to the target document. The array MUST contain at least one value.',
    },
    targetSpecs: Overlay12,
  },
  {
    label: 'components',
    insertText: 'components',
    kind: 14,
    format: CompletionFormat.OBJECT,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '[Components Object](https://spec.openapis.org/overlay/v1.2.0.html#components-object)\n\\\n\\\nA set of components to reuse across the Overlay Document.',
    },
    targetSpecs: Overlay12,
  },
];

export default completion;
