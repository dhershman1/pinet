// Some built in custom tags you can use
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

  dictionary.defineTag('sig', {
    mustHaveValue: true,
    onTagged (doclet, tag) {
      doclet.signature = tag.value.split(/\r|\n|\n\r/g)
    }
  })

  dictionary.defineTag('recipe', {
    mustHaveValue: true,
    onTagged (doclet, tag) {
      doclet.recipe = tag.value.split(/\r|\n|\n\r/g)
    }
  })
}
