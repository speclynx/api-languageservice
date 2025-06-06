import { ArrayElement, Attributes, Meta } from '@char0n/apidom-core';

/**
 * @public
 */
class Tags extends ArrayElement {
  constructor(content?: unknown[], meta?: Meta, attributes?: Attributes) {
    super(content, meta, attributes);
    this.element = 'tags';
  }
}

export default Tags;
