import { MediaTypes } from '@char0n/apidom-core';

/**
 * @public
 */
export class YamlMediaTypes extends MediaTypes<string> {
  latest() {
    return this[1];
  }
}

/**
 * @public
 */
const mediaTypes = new YamlMediaTypes('text/yaml', 'application/yaml');

export default mediaTypes;
