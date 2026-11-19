/**
 * Responsible for going and building out source code pages for our functions
 */
const fs = require('fs-extra')
const path = require('path')
const hljs = require('highlight.js')
const js = require('highlight.js/lib/languages/javascript')
const { code, div, escape, h2, pre, text } = require('../engine')

hljs.registerLanguage('javascript', js)

/**
 * Creates source code pages for each function in the documentation
 * @param {Object} doclet The doclet object to build the source code for
 * @returns {Promise} A promise that resolves with the name and source code html block,
 * or `null` if the source file could not be read
 */
function source (doclet) {
  const file = path.join(doclet.meta.path, doclet.meta.filename)

  return fs.readFile(file, 'utf-8')
    .then(sourceCode => ({
      name: doclet.name,
      html: div({ class: 'source__wrapper' }, [
        h2({ class: 'source__header' }, [escape(doclet.name)]),
        pre({ class: 'source__code' }, [
          code({ class: 'hljs javascript' }, [text(hljs.highlight(sourceCode, { language: 'javascript' }).value)])
        ])
      ])
    }))
    .catch(err => {
      console.error(`Could not read the source for ${doclet.name} (${file}), skipping its source page`)
      console.error(err.message)

      return null
    })
}

module.exports = source
