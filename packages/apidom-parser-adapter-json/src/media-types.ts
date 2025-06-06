import { MediaTypes } from '@char0n/apidom-core';

/**
 * @public
 */
export class JSONMediaTypes extends MediaTypes<string> {
  latest() {
    return this[0];
  }
}

/**
 * @public
 */
const mediaTypes = new JSONMediaTypes('application/json');

export default mediaTypes;
