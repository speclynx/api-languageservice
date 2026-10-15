import {
  ApidomCompletionItem,
  CompletionFormat,
  CompletionType,
} from '../../../apidom-language-types.ts';
import { Overlay12 } from '../target-specs.ts';

const completion: ApidomCompletionItem[] = [
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
      value:
        '**REQUIRED** A JSONPath query expression, as described in [RFC9535](https://www.rfc-editor.org/rfc/rfc9535), referencing the target objects in the source document.',
    },
    targetSpecs: Overlay12,
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
    targetSpecs: Overlay12,
  },
];

export default completion;
