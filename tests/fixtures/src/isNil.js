/**
 * Checks if a value is `null` or `undefined`
 *
 * - Works for both `null` and `undefined`
 * - Everything else is `false`
 *
 * ```js
 * isNil(null) // => true
 * ```
 * @function
 * @category Type
 * @since v1.0.0
 * @see add
 * @param {*} x The value to check
 * @return {Boolean} Whether the value is nil
 */
function isNil (x) {
  return x == null
}

module.exports = isNil
