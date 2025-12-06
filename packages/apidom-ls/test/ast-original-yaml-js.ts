/* eslint-disable @typescript-eslint/no-explicit-any */
import YAML from 'yaml-js';
import { memoizeWith, identity } from 'ramda';
import { isArray } from 'ramda-adjunct';

/* TODO this is taken from swagger-editor, we would instead import it from swagger-editor when dist will change
    to support single file import
 */
// @ts-ignore
const cachedCompose = memoizeWith(identity, YAML.compose); // TODO: build a custom cache based on content

const MAP_TAG = 'tag:yaml.org,2002:map';
const SEQ_TAG = 'tag:yaml.org,2002:seq';

/**
 * Get a position object with given
 * @param  {string}   yaml
 * YAML or JSON string
 * @param  {array}   path
 * an array of stings that constructs a
 * JSON Path similar to JSON Pointers(RFC 6901). The difference is, each
 * component of path is an item of the array instead of being separated with
 * slash(/) in a string
 */
export function positionRangeForPath(yaml: any, path: any) {
  // Type check
  if (typeof yaml !== 'string') {
    throw new TypeError('yaml should be a string');
  }
  if (!isArray(path)) {
    throw new TypeError('path should be an array of strings');
  }

  const invalidRange = {
    start: { line: -1, column: -1 },
    end: { line: -1, column: -1 },
  };
  let i = 0;

  const ast = cachedCompose(yaml);

  // simply walks the tree using astValue path recursively to the point that
  // path is empty.
  return find(ast);

  function find(astValue: any, astKeyValue?: any): any {
    if (astValue.tag === MAP_TAG) {
      for (i = 0; i < astValue.value.length; i++) {
        const pair = astValue.value[i];
        const key = pair[0];
        const value = pair[1];
        if (key.value === path[0]?.replace(/~1/g, '/')) {
          path.shift();
          return find(value, key);
        }
      }
    }

    if (astValue.tag === SEQ_TAG) {
      const item = astValue.value[path[0]?.replace(/~1/g, '/')];
      if (item && item.tag) {
        path.shift();
        return find(item, astKeyValue);
      }
    }

    // if path is still not empty we were not able to find the node
    if (path.length) {
      // if path is "" return the whole doc
      if (path.length === 1 && path[0].replace(/~1/g, '/') === '') {
        return {
          start: {
            line: astValue.start_mark.line,
            column: astValue.start_mark.column,
            pointer: astValue.start_mark.pointer,
          },
          end: {
            line: astValue.end_mark.line,
            column: astValue.end_mark.column,
            pointer: astValue.end_mark.pointer,
          },
        };
      }
      return invalidRange;
    }

    const range: any = {
      start: {
        line: astValue.start_mark.line,
        column: astValue.start_mark.column,
        pointer: astValue.start_mark.pointer,
      },
      end: {
        line: astValue.end_mark.line,
        column: astValue.end_mark.column,
        pointer: astValue.end_mark.pointer,
      },
    };

    if (astKeyValue) {
      range.key_start = {
        line: astKeyValue.start_mark.line,
        column: astKeyValue.start_mark.column,
        pointer: astKeyValue.start_mark.pointer,
      };

      range.key_end = {
        line: astKeyValue.end_mark.line,
        column: astKeyValue.end_mark.column,
        pointer: astKeyValue.end_mark.pointer,
      };
    }

    return range;
  }
}

// utility fns

export const positionRangeForPathAsync = promisifySyncFn(positionRangeForPath);

function promisifySyncFn(fn: any) {
  return function (...args: any) {
    return new Promise((resolve) => resolve(fn(...args)));
  };
}
