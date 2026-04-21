import { Overlay11 } from '../target-specs.ts';

const documentation = [
  {
    target: 'title',
    docs: '**REQUIRED**. A human readable description of the purpose of the overlay.',
    targetSpecs: Overlay11,
  },
  {
    target: 'version',
    docs: '**REQUIRED**. A version identifier for indicating changes to the Overlay document.',
    targetSpecs: Overlay11,
  },
  {
    target: 'description',
    docs: 'A description of the Overlay Document. [CommonMark](https://spec.commonmark.org/) syntax MAY be used for rich text representation.',
    targetSpecs: Overlay11,
  },
  {
    docs: '#### [Info Object](https://spec.openapis.org/overlay/v1.1.0.html#info-object)\n\nThe object provides metadata about the Overlay.\nThe metadata MAY be used by the clients if needed.\n\n##### Fixed Fields\n\nField Name | Type | Description\n---|:---:|---\ntitle | `string` | **REQUIRED**. A human readable description of the purpose of the overlay.\nversion | `string` | **REQUIRED**. A version identifier for indicating changes to the Overlay document.\ndescription | `string` | A description of the Overlay Document. [CommonMark](https://spec.commonmark.org/) syntax MAY be used for rich text representation.\n\n\\\nThis object MAY be extended with [Specification Extensions](https://spec.openapis.org/overlay/v1.1.0.html#specification-extensions).\n\n##### Info Object Example\n\n\n\\\nJSON\n```json\n{\n  "title": "Targeted Overlay",\n  "version": "1.0.0"\n}\n```\n\n\n\\\nYAML\n```yaml\ntitle: Targeted Overlay\nversion: 1.0.0\n```',
    targetSpecs: Overlay11,
  },
];

export default documentation;
