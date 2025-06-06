import { keyMap as keyMapBase } from '@char0n/apidom-core';

export { getNodeType } from '@char0n/apidom-ns-json-schema-2019-09';
/**
 * @public
 */
export const keyMap = {
  JSONSchema202012Element: ['content'],
  LinkDescriptionElement: ['content'],
  ...keyMapBase,
};
