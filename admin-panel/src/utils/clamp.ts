/**
 * Clamps a number within the inclusive range specified by the lower and upper bounds.
 * @param {number} num - The number to clamp.
 * @param {number} lower - The lower bound of the range.
 * @param {number} upper - The upper bound of the range.
 * @returns {number} The clamped value. If num is less than lower, returns lower. If num is greater than upper, returns upper. Otherwise, returns num.
 */
export function clamp(num: number, lower: number, upper: number) {
  return Math.min(Math.max(num, lower), upper);
}
