import { NamespaceVersion } from '../../../apidom-language-types.ts';

/**
 * @public
 */
export const JSONSchema202012 = [{ namespace: 'json-schema', version: '2020-12' }];

/**
 * @public
 */
export const assoc =
  (targetSpecs: NamespaceVersion[]) =>
  <T>(rule: T): T => ({
    ...rule,
    targetSpecs,
  });

/**
 * @public
 */
export const compose = <T>(rules: ReadonlyArray<T | T[]>, transformer?: (rule: T) => T) => {
  if (typeof transformer === 'function') {
    return (rules.flat(+Infinity) as T[]).map(transformer);
  }
  return rules.flat();
};
