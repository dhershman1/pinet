const { map } = require('kyanite')
const hljs = require('highlight.js')
const js = require('highlight.js/lib/languages/javascript')
const { pre, code, text } = require('../engine')

hljs.registerLanguage('javascript', js)

/**
 * Handles building out the html block for code examples
 * @param {Array} ex An array of examples from a doclet
 */
function examples (ex = []) {
  return pre({}, [
    code({ class: 'hljs javascript' }, map(x => text(hljs.highlight('javascript', x).value), ex))
  ])
}

module.exports = examples
