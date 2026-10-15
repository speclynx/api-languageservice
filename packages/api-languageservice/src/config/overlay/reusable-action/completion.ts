import {
  ApidomCompletionItem,
  CompletionFormat,
  CompletionType,
} from '../../../apidom-language-types.ts';
import { Overlay12 } from '../target-specs.ts';

const completion: ApidomCompletionItem[] = [
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
        'A description of the reusable action. This description is independent of the `description` field on the contained [Action Object](https://spec.openapis.org/overlay/v1.2.0.html#action-object) and is intended to document the reusable action itself (for example, its purpose or usage). [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.',
    },
    targetSpecs: Overlay12,
  },
  {
    label: 'fields',
    insertText: 'fields',
    kind: 14,
    format: CompletionFormat.OBJECT,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        '[Action Object](https://spec.openapis.org/overlay/v1.2.0.html#action-object)\n\\\n\\\nAn [Action Object](https://spec.openapis.org/overlay/v1.2.0.html#action-object) where no field is required, except that the `target` field MUST NOT be provided. The `target` MUST be supplied by the [Reusable Action Reference Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-reference-object).',
    },
    targetSpecs: Overlay12,
  },
];

export default completion;
