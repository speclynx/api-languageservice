import { keyMap as keyMapBase } from '@char0n/apidom-core';

export { getNodeType } from '@char0n/apidom-ns-json-schema-draft-6';

/**
 * @public
 */
export const keyMap = {
  JSONSchemaDraft7Element: ['content'],
  JSONReferenceElement: ['content'],
  LinkDescriptionElement: ['content'],
  ...keyMapBase,
};
