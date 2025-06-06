import { mediaTypes, ArazzoMediaTypes } from '@char0n/apidom-ns-arazzo-1';

/**
 * @public
 */
const yamlMediaTypes = new ArazzoMediaTypes(
  ...mediaTypes.filterByFormat('generic'),
  ...mediaTypes.filterByFormat('yaml'),
);

export default yamlMediaTypes;
