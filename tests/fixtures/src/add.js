/**
 * Adds two numbers together
 * @function
 * @category Math
 * @sig Number -> Number -> Number
 * @since v1.0.0
 * @param {Number} a The first number
 * @param {Number} [b=0] The second number
 * @return {Number} The sum of both numbers
 * @example
 * add(1, 2) // => 3
 * @example
 * add(1) // => 1
 */
function add (a, b = 0) {
  return a + b
}

module.exports = add
