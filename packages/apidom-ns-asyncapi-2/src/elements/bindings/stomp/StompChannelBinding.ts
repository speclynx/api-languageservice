import { ObjectElement, Attributes, Meta } from '@char0n/apidom-core';

/**
 * @public
 */
class StompChannelBinding extends ObjectElement {
  constructor(content?: Record<string, unknown>, meta?: Meta, attributes?: Attributes) {
    super(content, meta, attributes);
    this.element = 'stompChannelBinding';
    this.classes.push('channel-binding');
  }
}

export default StompChannelBinding;
