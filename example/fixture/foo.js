
/**
 * @name subtract
 * @function
 * @since v0.1.0
 * @description A foo subtractor
 * @category Math
 * @signature Number -> Number -> Number
 * @param {Number} a The number to subtract from
 * @param {Number} b The number to subtract with
 * @return {Number} The remainder
 * @example
 * import { subtract } from 'kyanite'
 *
 * subtract(2, 1) // => 1
 *
 * // It's also curried
 *
 * const sub = subtract(5)
 *
 * sub(3) // => 2
 * sub(2) // => 3
 */
function foo (a, b) {
  return a - b
}
