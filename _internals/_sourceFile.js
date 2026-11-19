/**
 * Turns a doclet name into the file name of its source page
 * Characters that aren't safe in a file name or a link (like the `/` in `utils/math`) become `_`
 * @private
 * @param {String} name The doclet name
 * @returns {String} The file name for the source page
 */
function _sourceFile (name) {
  return `${String(name).replace(/[^\w.-]/g, '_')}.html`
}

module.exports = _sourceFile
