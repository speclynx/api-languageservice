import {
  ApidomCompletionItem,
  CompletionFormat,
  CompletionType,
} from '../../../apidom-language-types.ts';
import { Overlay12 } from '../target-specs.ts';

const completion: ApidomCompletionItem[] = [
  {
    label: 'actions',
    insertText: 'actions',
    kind: 14,
    format: CompletionFormat.OBJECT,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value:
        'Map[`string`, [Reusable Action Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-object)]\n\\\n\\\nA key-value set of reusable actions to reference in the actions through a [Reusable Action Reference Object](https://spec.openapis.org/overlay/v1.2.0.html#reusable-action-reference-object).',
    },
    targetSpecs: Overlay12,
  },
];

export default completion;
