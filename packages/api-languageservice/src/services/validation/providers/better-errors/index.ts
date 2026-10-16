/*
 * SPDX-FileCopyrightText: Copyright 2018 Atlassian Pty Ltd
 * SPDX-FileCopyrightText: Copyright 2026 SpecLynx
 * SPDX-License-Identifier: Apache-2.0
 *
 * Ported from @stoplight/better-ajv-errors@1.0.3 and modified by SpecLynx: rewritten in
 * TypeScript with functions in place of one class per keyword, JSON Pointers resolved with
 * @swaggerexpert/json-pointer instead of jsonpointer, the distance from leven replaced by a local
 * implementation, and the unused schema argument dropped. The property path option is dropped as
 * well, since the provider always passed an empty one, so the document is passed directly. The
 * output is unchanged.
 */
import { getByPointer } from './json-pointer.ts';
import { levenshtein } from './levenshtein.ts';

/** The fields of an Ajv error object the formatter reads. */
export interface AjvErrorObject {
  keyword: string;
  instancePath: string;
  /** set on every error unless Ajv is created with `messages: false` */
  message?: string;
  params: { additionalProperty?: string; allowedValues?: unknown[] };
}

export interface BetterError {
  error: string;
  path: string;
  suggestion?: string;
}

interface ErrorTreeNode {
  children: Record<string, ErrorTreeNode>;
  errors: AjvErrorObject[];
}

/*
 * One tree key per property, an array index staying with the property that holds the array. A
 * segment is cut short at any other character, such as the `~` of an escape, and skipped when it
 * starts with one, so errors on different paths can share a node. The port keeps this, since it
 * decides which errors are merged and filtered.
 */
const INSTANCE_PATH_SEGMENTS = /\/[\w$_-]+(\/\d+)?/g;

const isAnyOfError = (error: AjvErrorObject) => error.keyword === 'anyOf';
const isEnumError = (error: AjvErrorObject) => error.keyword === 'enum';

const cleanAjvMessage = (message: string) => message.replace(/['"]/g, '"').replace(/NOT/g, 'not');

const capitalize = (word: string) => word.replace(/^[a-z]/, (letter) => letter.toUpperCase());

const lastSegment = (instancePath: string): string | null => {
  const index = instancePath.lastIndexOf('/');
  return index === -1 ? null : instancePath.slice(index + 1);
};

const propertyValue = (instancePath: string, document: unknown) =>
  instancePath === '' ? document : getByPointer(document, instancePath);

const prettyPropertyName = (instancePath: string, document: unknown) => {
  const name = lastSegment(instancePath);
  return name === null
    ? capitalize(typeof propertyValue(instancePath, document))
    : `"${name}" property`;
};

const bestEnumMatch = (
  instancePath: string,
  allowedValues: unknown[],
  document: unknown,
): string | null => {
  const currentValue = propertyValue(instancePath, document);
  if (typeof currentValue !== 'string') {
    return null;
  }
  const matches = allowedValues
    .filter((value): value is string => typeof value === 'string')
    .map((value) => ({ value, weight: levenshtein(value, currentValue) }))
    .sort((one, other) => one.weight - other.weight);
  if (matches.length === 0) {
    return null;
  }
  const [bestMatch] = matches;
  return allowedValues.length === 1 || bestMatch.weight < bestMatch.value.length
    ? bestMatch.value
    : null;
};

const formatEnumError = (
  { message = '', instancePath }: AjvErrorObject,
  allowedValues: unknown[],
  document: unknown,
): BetterError => {
  const listedValues = allowedValues
    .map((value) => (typeof value === 'string' ? `"${value}"` : JSON.stringify(value)))
    .join(', ');
  const output: BetterError = {
    error: `${prettyPropertyName(instancePath, document)} ${message}: ${listedValues}`,
    path: instancePath,
  };
  const bestMatch = bestEnumMatch(instancePath, allowedValues, document);
  if (bestMatch !== null) {
    output.suggestion = `Did you mean "${bestMatch}"?`;
  }
  return output;
};

const formatError = (
  { keyword, instancePath, params, message = '' }: AjvErrorObject,
  document: unknown,
): BetterError => {
  switch (keyword) {
    case 'additionalProperties':
      return {
        error: `Property "${params.additionalProperty}" is not expected to be here`,
        path: instancePath,
      };
    case 'type': {
      const name = lastSegment(instancePath);
      return {
        error: name === null ? `Value type ${message}` : `"${name}" property type ${message}`,
        path: instancePath,
      };
    }
    case 'errorMessage':
      return { error: message, path: instancePath };
    default:
      // `required` and every other keyword
      return {
        error: `${prettyPropertyName(instancePath, document)} ${cleanAjvMessage(message)}`,
        path: instancePath,
      };
  }
};

const makeTree = (ajvErrors: readonly AjvErrorObject[]): ErrorTreeNode => {
  const root: ErrorTreeNode = { children: {}, errors: [] };
  ajvErrors.forEach((ajvError) => {
    const { instancePath } = ajvError;
    const segments = instancePath === '' ? [''] : instancePath.match(INSTANCE_PATH_SEGMENTS);
    segments?.reduce((node, segment, index) => {
      node.children[segment] ??= { children: {}, errors: [] };
      if (index === segments.length - 1) {
        node.children[segment].errors.push(ajvError);
      }
      return node.children[segment];
    }, root);
  });
  return root;
};

const filterRedundantErrors = (node: ErrorTreeNode, parent?: ErrorTreeNode, key?: string) => {
  // an `anyOf` error means the errors further down say more, if there are any
  if (node.errors.some(isAnyOfError) && Object.keys(node.children).length > 0) {
    node.errors = [];
  }
  /*
   * A node with only `enum` errors is dropped when it has a sibling. The original meant siblings
   * with errors, but its test passed any sibling, since an empty error list is truthy; the port
   * keeps the behaviour.
   */
  if (
    node.errors.length > 0 &&
    node.errors.every(isEnumError) &&
    parent !== undefined &&
    key !== undefined &&
    Object.keys(parent.children).length > 1
  ) {
    delete parent.children[key];
  }
  Object.entries(node.children).forEach(([childKey, child]) =>
    filterRedundantErrors(child, node, childKey),
  );
};

const formatTree = (node: ErrorTreeNode, document: unknown): BetterError[] => {
  const { errors } = node;
  // `enum` errors on one node become a single error listing every allowed value, once
  if (errors.length > 0 && errors.every(isEnumError)) {
    const allowedValues = [...new Set(errors.flatMap((error) => error.params.allowedValues ?? []))];
    return [formatEnumError(errors[0], allowedValues, document)];
  }
  return [
    ...errors.map((error) => formatError(error, document)),
    ...Object.values(node.children).flatMap((child) => formatTree(child, document)),
  ];
};

/**
 * Turns the errors Ajv reported for `document` into fewer, more readable ones: it keeps the most
 * specific errors under an `anyOf`, merges `enum` errors, words messages after the property they
 * concern and suggests the closest allowed value for a mistyped `enum` string.
 */
export const betterAjvErrors = (
  ajvErrors: readonly AjvErrorObject[],
  document: unknown,
): BetterError[] => {
  const tree = makeTree(ajvErrors);
  filterRedundantErrors(tree);
  return formatTree(tree, document);
};
