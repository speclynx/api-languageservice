import { BooleanElement, BREAK } from '@char0n/apidom-core';
import {
  ItemsVisitor as JSONSchemaDraft4ItemsVisitor,
  ItemsVisitorOptions,
} from '@char0n/apidom-ns-json-schema-draft-4';

export type { ItemsVisitorOptions };

/**
 * @public
 */
class ItemsVisitor extends JSONSchemaDraft4ItemsVisitor {
  BooleanElement(booleanElement: BooleanElement) {
    this.element = this.toRefractedElement(['document', 'objects', 'JSONSchema'], booleanElement);

    return BREAK;
  }
}

export default ItemsVisitor;
