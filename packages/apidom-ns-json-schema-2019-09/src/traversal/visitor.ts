import { keyMap as keyMapBase } from '@char0n/apidom-core';

export { getNodeType } from '@char0n/apidom-ns-json-schema-draft-7';

/**
 * @public
 */
export const keyMap = {
  JSONSchema201909Element: ['content'],
  LinkDescriptionElement: ['content'],
  ...keyMapBase,
};
