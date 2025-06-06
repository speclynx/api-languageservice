import { keyMap as keyMapBase } from '@char0n/apidom-core';

export { getNodeType } from '@char0n/apidom-ns-json-schema-draft-4';

/**
 * @public
 */
export const keyMap = {
  JSONSchemaDraft6Element: ['content'],
  JSONReferenceElement: ['content'],
  MediaElement: ['content'],
  LinkDescriptionElement: ['content'],
  ...keyMapBase,
};
