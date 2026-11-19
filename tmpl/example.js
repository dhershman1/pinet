const { map } = require('kyanite')
const hljs = require('highlight.js')
const js = require('highlight.js/lib/languages/javascript')
const { pre, code, text } = require('../engine')

hljs.registerLanguage('javascript', js)

/**
 * Handles building out the html block for code examples
 * Each example is highlighted on its own and placed on its own line
 * @param {Array} ex An array of examples from a doclet
 * @returns {String} The html for the examples block
 */
function examples (ex = []) {
  const highlighted = map(x => hljs.highlight(x, { language: 'javascript' }).value, ex)

  return pre({}, [
    code({ class: 'hljs javascript' }, [text(highlighted.join('\n'))])
  ])
}

module.exports = examples
