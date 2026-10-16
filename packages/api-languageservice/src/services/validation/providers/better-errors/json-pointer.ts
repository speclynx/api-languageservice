import { evaluate, JSONPointerEvaluateError } from '@swaggerexpert/json-pointer';

/**
 * The value `jsonPointer` points to in `document`, or `undefined` when it points to nothing: a
 * missing key, an index that is out of range or not an index, or a step through `null` or a
 * primitive. Unlike `jsonpointer.get`, which better-ajv-errors used, it does not resolve a member
 * inherited from `Object.prototype` or the `length` of an array; Ajv never reports such a path. A
 * malformed pointer still throws; Ajv never produces one either.
 */
export const getByPointer = (document: unknown, jsonPointer: string): unknown => {
  try {
    return evaluate(document, jsonPointer);
  } catch (error) {
    if (error instanceof JSONPointerEvaluateError) return undefined;
    throw error;
  }
};
