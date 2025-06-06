import { mediaTypes, AsyncAPIMediaTypes } from '@char0n/apidom-ns-asyncapi-2';

/**
 * @public
 */
const yamlMediaTypes = new AsyncAPIMediaTypes(
  ...mediaTypes.filterByFormat('generic'),
  ...mediaTypes.filterByFormat('yaml'),
);

export default yamlMediaTypes;
