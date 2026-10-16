import YAML, { LineCounter, isMap, isSeq, Pair, Scalar, YAMLMap } from 'yaml';
import { isArray } from 'ramda-adjunct';

function parseDoc(src: string) {
  const lc = new LineCounter();
  // the resolver picks among duplicate keys itself; yaml's report of them rescans a mapping per key
  const doc = YAML.parseDocument(src, {
    keepSourceTokens: true,
    uniqueKeys: false,
    lineCounter: lc,
  });
  return { doc, lc };
}

type PairForKey = (map: YAMLMap, key: string) => Pair | undefined;

function nodeForPath(
  node: any,
  curkey: any,
  objectMember: boolean,
  p: string[],
  pairForKey: PairForKey,
): any {
  if (!p.length) {
    return {
      value: node,
      key: curkey,
      objectMember,
    };
  }
  const key = p.shift()!.replace(/~1/g, '/').replace(/~0/g, '~');
  if (isMap(node)) {
    const pair = pairForKey(node, key);
    return pair ? nodeForPath(pair.value, pair.key, true, p, pairForKey) : undefined;
  }
  if (isSeq(node)) {
    const idx = Number(key);
    return node.items[idx] ? nodeForPath(node.items[idx], curkey, false, p, pairForKey) : undefined;
  }
  return undefined;
}

/**
 * Parses `src` once and returns a function resolving JSON Pointer reference tokens to source
 * ranges, so one validation run parses the document once however many errors it reports.
 *
 * `object_member` tells an object member, whose `key_start`/`key_end` are its own key, from an
 * array item, whose `key_start`/`key_end` are those of the enclosing array. `lastDuplicateKey`
 * resolves a duplicated key to its last occurrence, the one `JSON.parse` keeps.
 */
export function createPathPositionResolver(
  src: string,
  { lastDuplicateKey = false }: { lastDuplicateKey?: boolean } = {},
) {
  function invalid() {
    return { start: { line: -1, column: -1 }, end: { line: -1, column: -1 } };
  }

  // Type check
  if (typeof src !== 'string') {
    throw new TypeError('yaml should be a string');
  }
  /*
   * `yaml` breaks lines only at LF and CRLF. A lone CR is whitespace in JSON and a line break in
   * YAML 1.2 and in LSP positions, so it is read as LF, which keeps every offset.
   */
  const { doc, lc } = parseDoc(src.replace(/\r(?!\n)/g, '\n'));

  // a mapping's keys are indexed when first looked up, so errors in a large mapping cost no rescans
  const pairIndexes = new Map<YAMLMap, Map<string, Pair>>();
  const pairForKey: PairForKey = (map, key) => {
    let pairsByKey = pairIndexes.get(map);
    if (!pairsByKey) {
      pairsByKey = new Map();
      for (const pair of map.items as Pair[]) {
        const pairKey = String((pair.key as Scalar).value);
        if (lastDuplicateKey || !pairsByKey.has(pairKey)) {
          pairsByKey.set(pairKey, pair);
        }
      }
      pairIndexes.set(map, pairsByKey);
    }
    return pairsByKey.get(key);
  };

  return (path: string[]) => {
    if (!isArray(path)) {
      throw new TypeError('path should be an array of strings');
    }
    const node = nodeForPath(doc.contents, null, false, [...path], pairForKey);
    if (!node) {
      return invalid();
    }
    if (!node.value || !node.value.range) return invalid();
    const [start, end] = node.value.range;
    const startPos = lc.linePos(start);
    const endPos = lc.linePos(end);
    const result: any = {};
    result.start = { line: startPos.line - 1, column: startPos.col - 1 };
    result.end = { line: endPos.line - 1, column: endPos.col - 1 };
    result.object_member = node.objectMember;
    if (node.key && node.key.range) {
      const [keystart, keyend] = node.key.range;
      const keyStartPos = lc.linePos(keystart);
      const keyEndPos = lc.linePos(keyend);
      result.key_start = { line: keyStartPos.line - 1, column: keyStartPos.col - 1 };
      result.key_end = { line: keyEndPos.line - 1, column: keyEndPos.col - 1 };
    } else {
      result.key_start = { line: 0, column: 0 };
      result.key_end = { line: 0, column: 0 };
    }

    return result;
  };
}

export type PathPositionResolver = ReturnType<typeof createPathPositionResolver>;
