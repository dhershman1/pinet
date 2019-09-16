/**
 * Responsible for going and building out source code pages for our functions
 */
const fs = require('fs-extra')
const path = require('path')
const { map } = require('kyanite')
const hljs = require('highlight.js')
const js = require('highlight.js/lib/languages/javascript')
const { code, div, h2, pre, text } = require('../engine')

hljs.registerLanguage('javascript', js)

function source (doclet, opts) {
  return fs.mkdirp(path.join(opts.destination, 'source'))
    .then(() => fs.readFile(path.join(doclet.meta.path, doclet.meta.filename), 'utf-8'))
    .then(sourceCode => ({
      name: doclet.name,
      html: div({ class: 'source__wrapper' }, [
        h2({ class: 'source__header' }, [text(doclet.name)]),
        pre({ class: 'source__code' }, [
          code({ class: 'hljs javascript' }, map(x => text(hljs.highlight('javascript', x).value), sourceCode))
        ])
      ])
    }))
    .catch(err => {
      console.error('Something went wrong trying to fetch the source code')
      console.error(err)
    })
}

module.exports = source
