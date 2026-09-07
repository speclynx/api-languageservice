import YAML, { LineCounter, isMap, isSeq, Pair, Scalar } from 'yaml';
import { identity, memoizeWith } from 'ramda';
import { isArray } from 'ramda-adjunct';

function parseDoc(src: string) {
  const lc = new LineCounter();
  const doc = YAML.parseDocument(src, {
    keepSourceTokens: true,
    lineCounter: lc,
  });
  return { doc, lc };
}

const cachedParse = memoizeWith(identity, parseDoc);

function nodeForPath(node: any, curkey: any, p: string[]): any {
  if (!p.length) {
    return {
      value: node,
      key: curkey,
    };
  }
  const key = p.shift()!.replace(/~1/g, '/');
  if (isMap(node)) {
    const pair = node.items.find((it: Pair) => String((it.key as Scalar).value) === key);
    return pair ? nodeForPath(pair.value, pair.key, p) : undefined;
  }
  if (isSeq(node)) {
    const idx = Number(key);
    return node.items[idx] ? nodeForPath(node.items[idx], curkey, p) : undefined;
  }
  return undefined;
}
export function positionRangeForPath(src: string, path: string[]) {
  function invalid() {
    return { start: { line: -1, column: -1 }, end: { line: -1, column: -1 } };
  }

  // Type check
  if (typeof src !== 'string') {
    throw new TypeError('yaml should be a string');
  }
  if (!isArray(path)) {
    throw new TypeError('path should be an array of strings');
  }
  const { doc, lc } = cachedParse(src);
  const node = nodeForPath(doc.contents, null, [...path]);
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
}

function promisify<T extends (...a: any[]) => any>(fn: T) {
  return (...a: Parameters<T>) => Promise.resolve(fn(...a));
}

export const positionRangeForPathAsync = promisify(positionRangeForPath);
