// Sequence generator function (commonly referred to as "range", e.g. Clojure, PHP, etc.)
//
// Example:
// Generate numbers range 0..4
// range(0, 4, 1);
// [0, 1, 2, 3, 4]
export const range = (start: number, stop: number, step: number = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
