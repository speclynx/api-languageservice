import {
  ApidomCompletionItem,
  CompletionFormat,
  CompletionType,
} from '../../../apidom-language-types.ts';
import { Overlay1, Overlay10, Overlay11 } from '../target-specs.ts';

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
];

export default completion;
