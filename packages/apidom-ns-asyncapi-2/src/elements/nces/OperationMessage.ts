import { ArrayElement, Attributes, Meta } from '@char0n/apidom-core';

/**
 * @public
 */
class OperationMessage extends ArrayElement {
  static primaryClass = 'operation-message';

  constructor(content?: Array<unknown>, meta?: Meta, attributes?: Attributes) {
    super(content, meta, attributes);
    this.classes.push(OperationMessage.primaryClass);
  }
}

export default OperationMessage;
