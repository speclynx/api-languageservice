import { mediaTypes, AsyncAPIMediaTypes } from '@char0n/apidom-ns-asyncapi-2';

/**
 * @public
 */
const jsonMediaTypes = new AsyncAPIMediaTypes(
  ...mediaTypes.filterByFormat('generic'),
  ...mediaTypes.filterByFormat('json'),
);

export default jsonMediaTypes;
