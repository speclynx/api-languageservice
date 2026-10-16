/**
 * The Levenshtein distance between two strings: the fewest single-character insertions,
 * deletions and substitutions that turn one into the other. Characters are UTF-16 code units.
 */
export const levenshtein = (first: string, second: string): number => {
  if (first === second) {
    return 0;
  }
  // the distance is symmetric, so the shorter string sizes the single row it is computed in
  const [shorter, longer] = first.length <= second.length ? [first, second] : [second, first];
  // a prefix or a suffix both strings share needs no edit, so only what lies between is compared
  let shorterEnd = shorter.length;
  let longerEnd = longer.length;
  while (
    shorterEnd > 0 &&
    shorter.charCodeAt(shorterEnd - 1) === longer.charCodeAt(longerEnd - 1)
  ) {
    shorterEnd -= 1;
    longerEnd -= 1;
  }
  let start = 0;
  while (start < shorterEnd && shorter.charCodeAt(start) === longer.charCodeAt(start)) {
    start += 1;
  }
  if (start === shorterEnd) {
    return longerEnd - start;
  }
  // row[index]: the distance from the part of `longer` read so far to the first `index`
  // characters of `shorter`, both counted from `start`
  const row = Array.from({ length: shorterEnd - start + 1 }, (_, index) => index);
  for (let longerIndex = start; longerIndex < longerEnd; longerIndex += 1) {
    const longerCharCode = longer.charCodeAt(longerIndex);
    // the previous row's value one column to the left, which the row no longer holds
    let diagonal = row[0];
    row[0] += 1;
    for (let index = 1; index < row.length; index += 1) {
      const above = row[index];
      const substitutionCost = shorter.charCodeAt(start + index - 1) === longerCharCode ? 0 : 1;
      row[index] = Math.min(above + 1, row[index - 1] + 1, diagonal + substitutionCost);
      diagonal = above;
    }
  }
  return row[row.length - 1];
};
