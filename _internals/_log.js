/**
 * A simple log wrapper to handle logging based on verbose flag
 * @private
 * @param {Boolean} verbose The verbose flag to determine if we should log or not
 * @returns {Function} A function that will log to the console if verbose is true
 */
function _log (verbose) {
  return function (...msg) {
    if (verbose) {
      console.log(...msg)
    }
  }
}

module.exports = _log
