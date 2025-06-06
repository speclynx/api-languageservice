import { StringElement } from '@char0n/apidom-core';

import FallbackVisitor, { FallbackVisitorOptions } from '../../FallbackVisitor.ts';

export type { FallbackVisitorOptions as UrlVisitorOptions };

/**
 * @public
 */
class UrlVisitor extends FallbackVisitor {
  declare public readonly element: StringElement;

  StringElement(stringElement: StringElement) {
    const result = super.enter(stringElement);
    this.element.classes.push('source-description-url');
    return result;
  }
}

export default UrlVisitor;
