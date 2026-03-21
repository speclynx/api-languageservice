import { escapeRegExp } from 'ramda-adjunct';
import {
  Element,
  ArrayElement,
  MemberElement,
  ObjectElement,
  isStringElement,
  isArrayElement,
  includesClasses,
} from '@speclynx/apidom-datamodel';
import { forEach } from '@speclynx/apidom-traverse';
import { toValue } from '@speclynx/apidom-core';
import { CompletionItem } from 'vscode-languageserver-types';
import {
  test as testPathTemplate,
  resolve as resolvePathTemplate,
  parse as parsePathTemplate,
} from 'openapi-path-templating';

import {
  isObject,
  isString,
  isArray,
  isNumber,
  isBoolean,
  isMember,
  processPath,
  getStringMetaValue,
  getClassesValue,
  getReferencedElementValue,
} from '../../utils/utils.ts';
import { FunctionItem } from '../../apidom-language-types.ts';

const regexCache = new Map<string, RegExp>();

const getCachedRegex = (pattern: string, flags?: string): RegExp => {
  const cacheKey = flags ? `${pattern}|||${flags}` : pattern;
  let regex = regexCache.get(cacheKey);
  if (!regex) {
    regex = new RegExp(pattern, flags);
    regexCache.set(cacheKey, regex);
  }
  return regex;
};

// Index for uniqueness checks: avoids O(n) full-tree traversal per element.
// Key: API root element -> Map<compositeKey, Map<value, count>>
// compositeKey encodes (elementOrClasses, key) as a string.
const uniquenessIndexCache = new WeakMap<Element, Map<string, Map<unknown, number>>>();

function getUniquenessIndex(
  api: Element,
  elementOrClasses: string[],
  key: string,
): Map<unknown, number> {
  let apiIndex = uniquenessIndexCache.get(api);
  if (!apiIndex) {
    apiIndex = new Map();
    uniquenessIndexCache.set(api, apiIndex);
  }

  const compositeKey = `${elementOrClasses.join(',')}|${key}`;
  let valueCountMap = apiIndex.get(compositeKey);
  if (valueCountMap) return valueCountMap;

  // Build index by traversing the full tree once
  valueCountMap = new Map();
  const classesSet = new Set(elementOrClasses);
  forEach(api, (path) => {
    const el = path.node;
    const matchesElement = classesSet.has(el.element);
    const matchesClasses =
      !matchesElement &&
      el.classes &&
      (getClassesValue(el) as string[]).every((v) => classesSet.has(v));
    if ((matchesElement || matchesClasses) && isObject(el) && el.hasKey(key)) {
      const val = toValue(el.get(key));
      valueCountMap!.set(val, (valueCountMap!.get(val) || 0) + 1);
    }
  });
  apiIndex.set(compositeKey, valueCountMap);
  return valueCountMap;
}

// Cache for getElementsByTypeOrClass: avoids repeated full-tree traversals.
// Key: API root element -> Map<typeOrClass, Element[]>
const elementsByTypeCache = new WeakMap<Element, Map<string, Element[]>>();

export function getElementsByTypeOrClass(api: Element, typeOrClass: string): Element[] {
  let apiCache = elementsByTypeCache.get(api);
  if (!apiCache) {
    apiCache = new Map();
    elementsByTypeCache.set(api, apiCache);
  }

  const cached = apiCache.get(typeOrClass);
  if (cached) return [...cached];

  const elements: Element[] = [];
  forEach(api, (path) => {
    const el = path.node;
    if (el.element === typeOrClass || includesClasses(el, [typeOrClass])) {
      elements.push(el);
    }
  });
  apiCache.set(typeOrClass, elements);
  return [...elements];
}

export const root = (el: Element): Element => {
  const rootElementTypes = [
    'swagger',
    'openApi3_0',
    'openApi3_1',
    'asyncApi2',
    'arazzoSpecification1',
  ];
  let node = el;

  while (node.parent && !rootElementTypes.includes(node.parent.element)) {
    node = node.parent;
  }

  return node.parent ?? node;
};

export const apilintElementOrClass = (element: Element, elementsOrClasses: string[]): boolean => {
  if (element) {
    const referencedElement = getReferencedElementValue(element);
    return (
      elementsOrClasses.includes(element.element) ||
      (referencedElement.length > 0 && elementsOrClasses.includes(referencedElement)) ||
      (element.classes &&
        (element.classes as string[]).some((v: string) => elementsOrClasses.includes(v)))
    );
  }
  return true;
};

const CASES: Record<string, string> = {
  camel: '[a-z][a-z{0-9}]*(?:[A-Z{0-9}](?:[a-z{0-9}]+|$))*',
  cobol: '[A-Z][A-Z{0-9}]*(?:-[A-Z{0-9}]+)*',
  flat: '[a-z][a-z{0-9}]*',
  kebab: '[a-z][a-z{0-9}]*(?:-[a-z{0-9}]+)*',
  macro: '[A-Z][A-Z{0-9}]*(?:_[A-Z{0-9}]+)*',
  pascal: '[A-Z][a-z{0-9}]*(?:[A-Z{0-9}](?:[a-z{0-9}]+|$))*',
  snake: '[a-z][a-z{0-9}]*(?:_[a-z{0-9}]+)*',
};

const CASES_NO_NUMBERS: Record<string, string> = {
  camel: '[a-z][a-z{}]*(?:[A-Z{}](?:[a-z{}]+|$))*',
  cobol: '[A-Z][A-Z{}]*(?:-[A-Z{}]+)*',
  flat: '[a-z][a-z{}]*',
  kebab: '[a-z][a-z{}]*(?:-[a-z{}]+)*',
  macro: '[A-Z][A-Z{}]*(?:_[A-Z{}]+)*',
  pascal: '[A-Z][a-z{}]*(?:[A-Z{}](?:[a-z{}]+|$))*',
  snake: '[a-z][a-z{}]*(?:_[a-z{}]+)*',
};

const casing = (
  value: string,
  casingStyle: string,
  noNumbers?: boolean,
  separatorChar?: string,
  separatorAsFirstChar?: boolean,
): boolean => {
  if (value.length === 1 && separatorAsFirstChar && value === separatorChar) {
    return true;
  }
  const casingRegexString = noNumbers ? CASES_NO_NUMBERS[casingStyle] : CASES[casingStyle];
  if (!casingRegexString) {
    return true;
  }
  let pattern = `^${casingRegexString}$`;
  if (separatorChar) {
    const separatorRegexString = `[${escapeRegExp(separatorChar)}]`;
    const separatorFirstCharString = separatorAsFirstChar ? `${separatorRegexString}?` : '';
    pattern = `^${separatorFirstCharString}${casingRegexString}(?:${separatorRegexString}${casingRegexString})*$`;
  }
  return getCachedRegex(pattern).test(value);
};

const isType = (element: Element, elementType: string): boolean => {
  switch (elementType) {
    case 'object':
      if (!isObject(element)) return false;
      break;
    case 'string':
      if (!isString(element)) return false;
      break;
    case 'number':
      if (!isNumber(element)) return false;
      break;
    case 'boolean':
      if (!isBoolean(element)) return false;
      break;
    case 'array':
      if (!isArray(element)) return false;
      break;
    default:
    //
  }
  return true;
};

export const standardLinterfunctions: FunctionItem[] = [
  {
    functionName: 'hasRequiredField',
    function: (element: Element, key: string): boolean => {
      if (element && isObject(element)) {
        if (!element.get(key)) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'missingField',
    function: (element: Element, key: string): boolean => {
      if (element && isObject(element)) {
        if (element.hasKey(key)) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'missingFields',
    function: (element: Element, keys: string[]): boolean => {
      if (element && isObject(element)) {
        for (const key of keys) {
          if (element.hasKey(key)) {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'existFields',
    function: (element: Element, keys: string[]): boolean => {
      if (element && isObject(element)) {
        for (const key of keys) {
          if (!element.hasKey(key)) {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'existAnyOfFields',
    function: (element: Element, keys: string[], allowEmpty: boolean): boolean => {
      if (element && isObject(element)) {
        if (!element.keys() || element.keys().length === 0) {
          return allowEmpty;
        }
        for (const key of keys) {
          if (element.hasKey(key)) {
            return true;
          }
        }
      }
      return false;
    },
  },
  {
    functionName: 'allowedFields',
    function: (
      element: Element,
      keys: string[],
      allowExtensionPrefix: string | undefined,
    ): boolean => {
      if (element && isObject(element)) {
        const allowedSet = new Set(keys);
        for (const keyValue of element.keys() as string[]) {
          if (!allowedSet.has(keyValue)) {
            if (allowExtensionPrefix === undefined || !keyValue.startsWith(allowExtensionPrefix)) {
              return false;
            }
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintFieldValueRegex',
    function: (element: Element, key: string, regexString: string): boolean => {
      if (element && isObject(element)) {
        if (element.get(key)) {
          if (!getCachedRegex(regexString).test(toValue(element.get(key)) as string)) {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintValueRegex',
    function: (element: Element, regexString: string, elementType?: string): boolean => {
      if (element) {
        if (!getCachedRegex(regexString).test(toValue(element) as string)) {
          return false;
        }
        if (elementType) {
          if (!isType(element, elementType)) {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintKeyRegex',
    function: (element: Element, regexString: string): boolean => {
      if (element && element.parent && isMember(element.parent)) {
        const elKey = toValue(element.parent.key as Element) as string;
        if (!getCachedRegex(regexString).test(elKey)) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintNumber',
    function: (
      element: Element,
      integer?: boolean,
      positive?: boolean,
      includesZero?: boolean,
    ): boolean => {
      if (element) {
        if (!isNumber(element)) {
          return false;
        }
        if (integer) {
          if (!Number.isInteger(toValue(element) as number)) {
            return false;
          }
        }
        if (positive && includesZero) {
          if ((toValue(element) as number) < 0) {
            return false;
          }
        } else if (positive && !includesZero) {
          if ((toValue(element) as number) <= 0) {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintValueOrArray',
    function: (element: Element, values: string[], unique?: boolean): boolean => {
      if (element) {
        const elValue = toValue(element);
        const isArrayVal = Array.isArray(elValue);
        if (!isArrayVal && !values.includes(elValue as string)) {
          return false;
        }
        if (isArrayVal && !elValue.every((v) => values.includes(v))) {
          return false;
        }
        if (unique && isArrayVal && new Set(elValue).size !== elValue.length) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintContainsValue',
    function: (element: Element, value: unknown): boolean => {
      if (element) {
        const elValue = toValue(element);
        const isArrayVal = Array.isArray(elValue);
        if (!isArrayVal && value !== elValue) {
          return false;
        }
        if (isArrayVal && !elValue.includes(value)) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintUniqueArray',
    function: (element: Element): boolean => {
      if (element) {
        const elValue = toValue(element);
        const isArrayVal = Array.isArray(elValue);
        if (!isArrayVal || new Set(elValue).size !== elValue.length) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintFieldValueOrArray',
    function: (element: Element, key: string, values: string[]): boolean => {
      if (element && isObject(element)) {
        if (element.get(key)) {
          const elValue = toValue(element.get(key));
          const isArrayVal = Array.isArray(elValue);
          if (!isArrayVal && !values.includes(elValue as string)) {
            return false;
          }
          if (isArrayVal && !elValue.every((v) => values.includes(v))) {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintType',
    function: (element: Element, elementType: string): boolean => {
      if (element) {
        if (!isType(element, elementType)) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintElementOrClass',
    function: apilintElementOrClass,
  },
  {
    functionName: 'apilintArrayOfElementsOrClasses',
    function: (element: Element, elementsOrClasses: string[], nonEmpty?: boolean): boolean => {
      if (element) {
        if (!isArray(element)) {
          return false;
        }
        for (const item of element as ArrayElement) {
          if (!apilintElementOrClass(item as Element, elementsOrClasses)) {
            return false;
          }
        }
        if (nonEmpty && (element as ArrayElement).length === 0) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintChildrenOfElementsOrClasses',
    function: (element: Element, elementsOrClasses: string[]): boolean => {
      if (element && !isObject(element)) {
        return false;
      }
      if (element && isObject(element)) {
        for (const member of element as ObjectElement) {
          if (!apilintElementOrClass((member as MemberElement).value!, elementsOrClasses)) {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintArray',
    function: (element: Element): boolean => {
      if (element) {
        const elValue = toValue(element);
        const isArrayVal = Array.isArray(elValue);
        if (!isArrayVal) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintArrayOfType',
    function: (element: Element, type: string, nonEmpty?: boolean): boolean => {
      if (element) {
        if (!isArray(element)) {
          return false;
        }
        for (const item of element as ArrayElement) {
          if (!isType(item as Element, type)) {
            return false;
          }
        }
        if (nonEmpty && (element as ArrayElement).length === 0) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintArrayNotEmpty',
    function: (element: Element): boolean => {
      if (element) {
        const elValue = toValue(element);
        if (Array.isArray(elValue) && elValue.length === 0) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintChildrenOfType',
    function: (element: Element, type: string, nonEmpty?: boolean): boolean => {
      if (element && isObject(element)) {
        for (const member of element as ObjectElement) {
          if (!isType((member as MemberElement).value!, type)) {
            return false;
          }
        }
        if (nonEmpty && (element as ObjectElement).length === 0) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintKeyIsRegex',
    function: (element: Element): boolean => {
      if (element && element.parent && isMember(element.parent)) {
        const elKey = toValue(element.parent.key as Element) as string;
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const regex = new RegExp(elKey);
        } catch {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintChildrenKeysAreRegex',
    function: (element: Element): boolean => {
      if (element && isObject(element)) {
        for (const member of element as ObjectElement) {
          const key = toValue((member as MemberElement).key as Element) as string;
          try {
            new RegExp(key);
          } catch {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintSiblingUniqueValue',
    function: (element: Element, key: string): boolean => {
      // Check if the value of `key` on this element is unique among sibling elements
      // in the parent array. The element is expected to be a child of an ArrayElement.
      if (!element || !isObject(element) || !element.parent) return true;
      const parent = element.parent;
      if (!isArray(parent)) return true;
      const myValue =
        isObject(element) && element.hasKey(key) ? toValue(element.get(key)) : undefined;
      if (myValue === undefined) return true;
      let count = 0;
      for (const sibling of parent as ArrayElement) {
        if (isObject(sibling) && sibling.hasKey(key)) {
          if (toValue(sibling.get(key)) === myValue) {
            count++;
            if (count > 1) return false;
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintSiblingUniqueCompositeValue',
    function: (element: Element, keys: string[]): boolean => {
      // Check uniqueness of composite key (multiple fields) among siblings in parent array
      if (!element || !isObject(element) || !element.parent) return true;
      const parent = element.parent;
      if (!isArray(parent)) return true;
      if (!keys.every((k) => isObject(element) && element.hasKey(k))) return true;
      const myValues = keys.map((k) => toValue(element.get(k)));
      const myComposite = JSON.stringify(myValues);
      let count = 0;
      for (const sibling of parent as ArrayElement) {
        if (isObject(sibling) && keys.every((k) => (sibling as ObjectElement).hasKey(k))) {
          const sibValues = keys.map((k) => toValue((sibling as ObjectElement).get(k)));
          if (JSON.stringify(sibValues) === myComposite) {
            count++;
            if (count > 1) return false;
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintArrayUniqueValues',
    function: (element: Element): boolean => {
      // Check that all values in an array are unique (e.g. dependsOn: [string, ...])
      if (!element || !isArray(element)) return true;
      const values = [...(element as ArrayElement)].map((el) => toValue(el));
      return values.length === new Set(values).size;
    },
  },
  {
    functionName: 'apilintMaxLength',
    function: (element: Element, maxLength: number): boolean => {
      if (element) {
        if (!isString(element)) {
          return false;
        }

        return (toValue(element) as string).length <= maxLength;
      }

      return true;
    },
  },
  {
    functionName: 'apilintMaximum',
    function: (element: Element, maximum: number): boolean => {
      if (element) {
        if (!isNumber(element)) {
          return false;
        }

        return (toValue(element) as number) <= maximum;
      }

      return true;
    },
  },
  {
    functionName: 'apilintMinimum',
    function: (element: Element, minimum: number): boolean => {
      if (element) {
        if (!isNumber(element)) {
          return false;
        }

        return (toValue(element) as number) <= minimum;
      }

      return true;
    },
  },
  {
    functionName: 'apilintValidURI',
    function: (element: Element, absolute = false): boolean => {
      if (element) {
        if (!isString(element)) {
          return false;
        }
        try {
          new URL(toValue(element) as string, absolute ? undefined : 'http://example.com');
        } catch {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apicompleteDiscriminator',
    function: (element: Element): CompletionItem[] => {
      const result: CompletionItem[] = [];
      if (element?.parent?.parent && isObject(element.parent.parent)) {
        const elParent = element.parent.parent;
        const elRequired: string[] = elParent.get('required')
          ? (toValue(elParent.get('required')) as string[])
          : [];
        for (const key of elRequired) {
          const item: CompletionItem = {
            label: key,
            insertText: key,
            kind: 12,
            documentation: '',
            // detail: 'replace with',
            insertTextFormat: 2,
          };
          result.push(item);
        }
      }
      return result;
    },
  },
  {
    functionName: 'apicompleteRequired',
    function: (element: Element): CompletionItem[] => {
      /*
       TODO this is made to work specifically for required in JSON and YAML, where the element parameter
       is different: In YAML it's the string array item, while in JSON with no quotes it's the parent array.
       */
      let targetElement = element?.parent;
      if (isArray(element)) {
        targetElement = element;
      }
      const result: CompletionItem[] = [];
      const existing: string[] = [];
      if (targetElement && Array.isArray(toValue(targetElement))) {
        existing.push(...(toValue(targetElement) as string[]));
      }
      if (targetElement?.parent?.parent && isObject(targetElement.parent.parent)) {
        const elParent = targetElement.parent.parent;
        const properties = elParent.get('properties') as ObjectElement | undefined;
        if (properties) {
          for (const key of properties.keys() as string[]) {
            if (!existing.includes(key)) {
              const item: CompletionItem = {
                label: key,
                insertText: key,
                kind: 12,
                documentation: '',
                // detail: 'replace with',
                insertTextFormat: 2,
              };
              result.push(item);
            }
          }
        }
      }
      return result;
    },
  },
  {
    functionName: 'apicompleteSecurity',
    function: (element: Element): CompletionItem[] => {
      const result: CompletionItem[] = [];

      if (element.parent?.parent) {
        const existing: string[] = [];
        if (element.element === 'securityRequirement' && isObject(element)) {
          existing.push(...(element.keys() as string[]));
        }
        if (isArray(element.parent)) {
          const api = root(element);
          const schemes = getElementsByTypeOrClass(api, 'securityScheme');

          for (const scheme of schemes) {
            const key = scheme.parent && isMember(scheme.parent) ? scheme.parent.key : undefined;
            if (key) {
              if (!existing.includes(toValue(key) as string)) {
                const item: CompletionItem = {
                  label: toValue(key) as string,
                  insertText: toValue(key) as string,
                  kind: 12,
                  documentation: '',
                  // detail: 'replace with',
                  insertTextFormat: 2,
                };
                result.push(item);
              }
            }
          }
        }
      }

      return result;
    },
  },
  {
    functionName: 'apilintDiscriminator',
    function: (element: Element): boolean => {
      if (element) {
        if (!isString(element)) {
          return false;
        }
      }
      if (element?.parent?.parent && isObject(element.parent.parent)) {
        const elParent = element.parent.parent;
        const elRequired: string[] = elParent.get('required')
          ? (toValue(elParent.get('required')) as string[])
          : [];
        return elRequired.includes(toValue(element) as string);
      }
      return true;
    },
  },
  {
    functionName: 'apilintKeysIncluded',
    function: (element: Element, path: string): boolean => {
      if (element && (isObject(element) || isArray(element))) {
        const api = root(element);

        const targetEl = processPath(element, path, api);
        if (!targetEl) {
          return true;
        }

        if (isObject(element)) {
          return element.keys().every((v) => (targetEl as ObjectElement).keys().includes(v));
        }
        if (isArray(element)) {
          const targetKeys = (targetEl as ObjectElement).keys() as string[];
          for (const item of element as ArrayElement) {
            if (!targetKeys.includes(toValue(item as Element) as string)) {
              return false;
            }
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintElementKeysIncluded',
    function: (element: Element, elementOrClass: string): boolean => {
      if (isObject(element) || isArray(element)) {
        const api = root(element);

        const elements = getElementsByTypeOrClass(api, elementOrClass);
        const targetKeys: string[] = [];
        for (const targetEl of elements) {
          if (isObject(targetEl)) {
            // @ts-ignore
            targetKeys.push(...targetEl.keys());
          }
        }
        if (isObject(element)) {
          // @ts-ignore
          return element.keys().every((v) => targetKeys.includes(toValue(v) as string));
        }
        if (isArray(element)) {
          for (const item of element as ArrayElement) {
            if (!targetKeys.includes(toValue(item as Element) as string)) {
              return false;
            }
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apicompleteChannelServers',
    function: (element: Element): CompletionItem[] => {
      const result: CompletionItem[] = [];

      if (element.parent?.parent) {
        const existing: string[] = [];
        if (isArray(element.parent)) {
          existing.push(...(toValue(element.parent) as string[]));
          const api = root(element);
          const servers = getElementsByTypeOrClass(api, 'server');

          for (const server of servers) {
            const key = server.parent && isMember(server.parent) ? server.parent.key : undefined;
            if (key) {
              if (!existing.includes(toValue(key) as string)) {
                const item: CompletionItem = {
                  label: toValue(key) as string,
                  insertText: toValue(key) as string,
                  kind: 12,
                  documentation: '',
                  // detail: 'replace with',
                  insertTextFormat: 2,
                };
                result.push(item);
              }
            }
          }
        }
      }

      return result;
    },
  },
  {
    functionName: 'apilintPropertyUniqueValue',
    function: (element: Element, elementOrClasses: string[], key: string): boolean => {
      const api = root(element);
      const value = toValue(element);
      const valueCountMap = getUniquenessIndex(api, elementOrClasses, key);
      const count = valueCountMap.get(value) || 0;
      return count <= 1;
    },
  },
  {
    functionName: 'apilintChannelParameterExist',
    function: (element: Element): boolean => {
      const referencedElement = getReferencedElementValue(element);
      // check ancestor to be a channelItem
      if (element.parent?.parent?.parent?.parent?.element !== 'channelItem') {
        return true;
      }
      if (element.element === 'parameter' || referencedElement === 'parameter') {
        const parameterName = toValue((element.parent as MemberElement).key as Element) as string;
        // We already verified element.parent.parent.parent.parent exists in the check above
        const channelEl: Element = element.parent!.parent!.parent!.parent!;
        const channelName: string = toValue(
          (channelEl.parent as MemberElement)?.key as Element,
        ) as string;
        if (channelName.indexOf(`{${parameterName}}`) === -1) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintKeysRegex',
    function: (element: Element, regexString: string): boolean => {
      if (element && isObject(element)) {
        const regex = getCachedRegex(regexString);
        return (element.keys() as string[]).every((v) => regex.test(v));
      }
      return true;
    },
  },
  {
    functionName: 'apilintMembersKeysRegex',
    function: (element: Element, regexString: string): boolean => {
      if (element && isObject(element)) {
        const regex = getCachedRegex(regexString);
        for (const key of element.keys() as string[]) {
          const member = element.get(key);
          if (member && isObject(member)) {
            if (!((member as ObjectElement).keys() as string[]).every((v) => regex.test(v))) {
              return false;
            }
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintNamedChildrenOfElementsOrClasess',
    function: (element: Element, keys: string[], elementsOrClasses: string[][]): boolean => {
      if (element && !isObject(element)) {
        return false;
      }
      if (element && isObject(element)) {
        for (let i = 0; i++; i < keys.length) {
          if (!apilintElementOrClass(element.get(keys[i])!, elementsOrClasses[i])) {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintNoDuplicateKeys',
    function: (element: Element): boolean => {
      if (element && isObject(element)) {
        const keys = element.keys() as string[];
        if (keys.length !== new Set(keys).size) {
          return false;
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintRequiredDefinedInProperties',
    function: (element: Element): boolean => {
      if (element && element.parent?.parent && isObject(element.parent?.parent)) {
        const required = toValue(element) as string[];
        const properties = element.parent.parent.get('properties') as ObjectElement | undefined;
        if (required) {
          for (const r of required) {
            if (!properties?.hasKey(r)) {
              return false;
            }
          }
        }
      }
      return true;
    },
  },
  {
    functionName: 'apilintFieldsKeysCasing',
    function: (
      element: Element,
      casingStyle: string,
      noNumbers?: boolean,
      separatorChar?: string,
      separatorAsFirstChar?: boolean,
    ): boolean => {
      if (element && !isObject(element)) {
        return true;
      }
      if (element && isObject(element)) {
        return (element.keys() as string[]).every((k) =>
          casing(k, casingStyle, noNumbers, separatorChar, separatorAsFirstChar),
        );
      }
      return true;
    },
  },
  {
    functionName: 'apilintFieldsValuesCasing',
    function: (
      element: Element,
      casingStyle: string,
      noNumbers?: boolean,
      separatorChar?: string,
      separatorAsFirstChar?: boolean,
    ): boolean => {
      if (element && !isObject(element)) {
        return true;
      }
      if (element && isObject(element)) {
        return (element.keys() as string[]).every((k) =>
          casing(
            toValue(element.get(k)) as string,
            casingStyle,
            noNumbers,
            separatorChar,
            separatorAsFirstChar,
          ),
        );
      }
      return true;
    },
  },
  {
    functionName: 'apilintValueCasing',
    function: (
      element: Element,
      casingStyle: string,
      noNumbers?: boolean,
      separatorChar?: string,
      separatorAsFirstChar?: boolean,
    ): boolean => {
      if (element) {
        return casing(
          toValue(element) as string,
          casingStyle,
          noNumbers,
          separatorChar,
          separatorAsFirstChar,
        );
      }
      return true;
    },
  },
  {
    functionName: 'apilintKeyCasing',
    function: (
      element: Element,
      casingStyle: string,
      noNumbers?: boolean,
      separatorChar?: string,
      separatorAsFirstChar?: boolean,
    ): boolean => {
      if (element && (!element.parent || !isMember(element.parent))) {
        return true;
      }
      if (element && element.parent && isMember(element.parent)) {
        const elKey = toValue(element.parent.key as Element) as string;
        return casing(elKey, casingStyle, noNumbers, separatorChar, separatorAsFirstChar);
      }
      return true;
    },
  },
  {
    functionName: 'apilintOperationRequestBodyAllowed',
    function: (element: Element, allowedHttpMethods: string[]): boolean => {
      const operationNode = element?.parent?.parent;
      if (!operationNode || operationNode.element !== 'operation') {
        return true;
      }
      const httpMethod = getStringMetaValue(operationNode, 'http-method', '');
      if (httpMethod && !allowedHttpMethods.includes(httpMethod)) {
        return false;
      }

      return true;
    },
  },
  {
    functionName: 'apilintIncludedInArray',
    function: (element: Element, path: string, arrayMustExist: boolean): boolean => {
      if (element && (isString(element) || isNumber(element))) {
        const api = root(element);

        const targetEl = processPath(element, path, api);
        if (!targetEl) {
          return !arrayMustExist;
        }
        const elementValue = toValue(element);
        for (const item of targetEl as ArrayElement) {
          if (toValue(item as Element) === elementValue) {
            return true;
          }
        }
        return false;
      }
      return true;
    },
  },
  {
    functionName: 'apilintOpenAPIPathTemplateWellFormed',
    function: (element: Element, strict = false) => {
      if (isStringElement(element)) {
        const pathTemplate = toValue(element) as string;
        return testPathTemplate(pathTemplate, { strict });
      }
      return true;
    },
  },
  {
    functionName: 'apilintOpenAPIPathTemplateValid',
    function: (element: Element) => {
      if (isStringElement(element)) {
        const pathItemElement = (element.parent as MemberElement).value as ObjectElement;

        if (pathItemElement.length === 0) {
          return true;
        }

        let oneOfParametersIsReferenceObject = false;
        const parameterElements: Element[] = [];
        const isParameterElement = (el: Element): boolean => el.element === 'parameter';
        const isReferenceElement = (el: Element): boolean => el.element === 'reference';

        const pathItemParameterElements = pathItemElement.get('parameters');
        if (isArrayElement(pathItemParameterElements)) {
          pathItemParameterElements.forEach((parameter) => {
            if (isReferenceElement(parameter) && !oneOfParametersIsReferenceObject) {
              oneOfParametersIsReferenceObject = true;
            }
            if (isParameterElement(parameter)) {
              parameterElements.push(parameter);
            }
          });
        }

        pathItemElement.forEach((el) => {
          if (el.element === 'operation') {
            const operationParameterElements = (el as ObjectElement).get('parameters');
            if (isArrayElement(operationParameterElements)) {
              operationParameterElements.forEach((parameter) => {
                if (isReferenceElement(parameter) && !oneOfParametersIsReferenceObject) {
                  oneOfParametersIsReferenceObject = true;
                }
                if (isParameterElement(parameter)) {
                  parameterElements.push(parameter);
                }
              });
            }
          }
        });

        const pathTemplateResolveParams: { [key: string]: 'placeholder' } = {};

        parameterElements.forEach((parameter) => {
          if (toValue((parameter as ObjectElement).get('in')) === 'path') {
            const paramName = toValue((parameter as ObjectElement).get('name')) as string;
            pathTemplateResolveParams[paramName] = 'placeholder';
          }
        });

        const pathTemplate = toValue(element) as string;
        const resolvedPathTemplate = resolvePathTemplate(pathTemplate, pathTemplateResolveParams);
        const includesTemplateExpression = testPathTemplate(resolvedPathTemplate, { strict: true });

        return !includesTemplateExpression || oneOfParametersIsReferenceObject;
      }

      return true;
    },
  },
  {
    functionName: 'apilintOpenAPIParameterInPathTemplate',
    function: (element: Element) => {
      if (element.element === 'parameter') {
        const parameterLocation = toValue((element as ObjectElement).get('in'));

        if (parameterLocation !== 'path') return true;

        const isInPathItemElement =
          isArrayElement(element.parent) &&
          includesClasses(element.parent, ['path-item-parameters']);

        const isInOperationElement =
          isArrayElement(element.parent) &&
          includesClasses(element.parent, ['operation-parameters']);

        if (!isInPathItemElement && !isInOperationElement) return true;

        const pathItemElement: Element | undefined = isInOperationElement
          ? element.parent?.parent?.parent?.parent?.parent
          : element.parent?.parent?.parent;

        if (pathItemElement?.element !== 'pathItem') return true;

        const isPathItemPartOfPathTemplating = pathItemElement.meta.hasKey('path');

        if (!isPathItemPartOfPathTemplating) return true;

        const pathTemplate = pathItemElement.meta.get('path');
        if (typeof pathTemplate !== 'string') return true;
        const parameterName = toValue((element as ObjectElement).get('name')) as string;

        const parseResult = parsePathTemplate(pathTemplate);
        if (!parseResult.result.success) return true;

        const parts: [string, string][] = [];
        parseResult.ast.translate(parts);

        return parts.some(
          ([name, value]) => name === 'template-expression-param-name' && value === parameterName,
        );
      }
      return true;
    },
  },
];

export const standardLinterfunctionsMap: Map<string, FunctionItem['function']> = new Map(
  standardLinterfunctions.map((item) => [item.functionName, item.function]),
);
