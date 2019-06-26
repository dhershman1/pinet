exports.defineTags = function (dictionary) {
  dictionary.defineTag('category', {
    mustHaveValue: true,
    onTagged (doclet, tag) {
      doclet.category = tag.value
    }
  })
  dictionary.defineTag('signature', {
    mustHaveValue: true,
    onTagged (doclet, tag) {
      doclet.signature = tag.value.split(/\r|\n|\n\r/g)
    }
  })
}
