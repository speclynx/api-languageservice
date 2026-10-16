/**
 * The Levenshtein distance between two strings: the fewest single-character insertions,
 * deletions and substitutions that turn one into the other. Characters are UTF-16 code units.
 */
export const levenshtein = (source: string, target: string): number => {
  // distances from the first `sourceIndex` characters of `source` to each prefix of `target`
  let previousRow = Array.from({ length: target.length + 1 }, (_, targetIndex) => targetIndex);
  for (let sourceIndex = 1; sourceIndex <= source.length; sourceIndex += 1) {
    const currentRow = [sourceIndex];
    for (let targetIndex = 1; targetIndex <= target.length; targetIndex += 1) {
      const substitutionCost = source[sourceIndex - 1] === target[targetIndex - 1] ? 0 : 1;
      currentRow[targetIndex] = Math.min(
        previousRow[targetIndex] + 1,
        currentRow[targetIndex - 1] + 1,
        previousRow[targetIndex - 1] + substitutionCost,
      );
    }
    previousRow = currentRow;
  }
  return previousRow[target.length];
};
