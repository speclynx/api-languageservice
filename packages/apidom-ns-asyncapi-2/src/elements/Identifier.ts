import { StringElement, Attributes, Meta } from '@char0n/apidom-core';

/**
 * @public
 */
class Identifier extends StringElement {
  constructor(content?: string, meta?: Meta, attributes?: Attributes) {
    super(content, meta, attributes);
    this.element = 'identifier';
  }
}

export default Identifier;
