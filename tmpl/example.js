const { map } = require('kyanite')
const { pre, code, text } = require('../engine')
const { highlight } = require('../_internals/_highlight')

/**
 * Handles building out the html block for code examples
 * Each example is highlighted on its own and placed on its own line
 * @param {Array} ex An array of examples from a doclet
 * @returns {String} The html for the examples block
 */
function examples (ex = []) {
  const highlighted = map(x => highlight(x, 'javascript'), ex)

  return pre({}, [
    code({ class: 'hljs javascript' }, [text(highlighted.join('\n'))])
  ])
}

module.exports = examples
