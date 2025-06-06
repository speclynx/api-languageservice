import { mediaTypes, ArazzoMediaTypes } from '@char0n/apidom-ns-arazzo-1';

/**
 * @public
 */
const jsonMediaTypes = new ArazzoMediaTypes(
  ...mediaTypes.filterByFormat('generic'),
  ...mediaTypes.filterByFormat('json'),
);

export default jsonMediaTypes;
