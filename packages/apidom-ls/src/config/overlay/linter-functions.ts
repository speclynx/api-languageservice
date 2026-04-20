import { test } from '@swaggerexpert/jsonpath';
import { toValue } from '@speclynx/apidom-core';
import { Element, isStringElement } from '@speclynx/apidom-datamodel';

/**
 * Validates that a string element contains a syntactically valid
 * RFC 9535 JSONPath expression. Non-string elements pass — a separate
 * type rule flags the type violation.
 */
export const apilintJSONPathRFC9535 = (element: Element): boolean => {
  if (!element || !isStringElement(element)) return true;
  const value = toValue(element) as string;
  return test(value);
};
