// Splits a tag value into lines, handling \r\n, \r, and \n line endings
const toLines = value => value.split(/\r\n|\r|\n/)

/**
 * Creates a tag definition that stores the tags value on the doclet
 * @param {String} prop The doclet property to store the value on
 * @param {Function} transform How to transform the tag value before storing it
 * @returns {Object} The tag definition jsdoc expects
 */
const storeAs = (prop, transform) => ({
  mustHaveValue: true,
  onTagged (doclet, tag) {
    doclet[prop] = transform(tag.value)
  }
})

// Some built in custom tags you can use
exports.defineTags = function (dictionary) {
  dictionary.defineTag('category', storeAs('category', value => value))
  dictionary.defineTag('signature', storeAs('signature', toLines))
  dictionary.defineTag('sig', storeAs('signature', toLines))
  dictionary.defineTag('recipe', storeAs('recipe', toLines))
}
