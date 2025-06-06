import { StringElement, Attributes, Meta } from '@char0n/apidom-core';

/**
 * @public
 */
class ArazzoSpec extends StringElement {
  constructor(content?: string, meta?: Meta, attributes?: Attributes) {
    super(content, meta, attributes);
    this.element = 'arazzoSpec';
    this.classes.push('spec-version');
    this.classes.push('version');
  }
}

export default ArazzoSpec;
