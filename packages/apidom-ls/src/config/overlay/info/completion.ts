import {
  ApidomCompletionItem,
  CompletionFormat,
  CompletionType,
} from '../../../apidom-language-types.ts';
import { Overlay11 } from '../target-specs.ts';

const completion: ApidomCompletionItem[] = [
  {
    label: 'title',
    insertText: 'title',
    kind: 14,
    format: CompletionFormat.QUOTED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value: '**REQUIRED**. A human readable description of the purpose of the overlay.',
    },
    targetSpecs: Overlay11,
  },
  {
    label: 'version',
    insertText: 'version',
    kind: 14,
    format: CompletionFormat.QUOTED_FORCED,
    type: CompletionType.PROPERTY,
    insertTextFormat: 2,
    documentation: {
      kind: 'markdown',
      value: '**REQUIRED**. A version identifier for indicating changes to the Overlay document.',
    },
    targetSpecs: Overlay11,
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
        'A description of the Overlay Document. [CommonMark](https://spec.commonmark.org/) syntax MAY be used for rich text representation.',
    },
    targetSpecs: Overlay11,
  },
];

export default completion;
