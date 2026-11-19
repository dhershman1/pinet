const { h2, span, escape, text } = require('../engine')
const { map, pathOr, propOr } = require('kyanite')

/**
 * Builds out our function title for each card
 * @param {Object} param0 The doclet parameters
 * @param {String} param0.name The function name
 * @param {String} param0.kind Is the function really a function or something else
 * @param {Array} param0.params The parameters the function accepts
 * @param {Array} param0.returns What the function returns
 * @returns {String} The html for the title
 */
function title ({ name, kind, params = [], returns = [] }) {
  const signature = kind === 'function'
    ? [
        span({ class: 'title__params' }, [
          text('('),
          escape(map(propOr('', 'name'), params).join(', ')),
          text(')')
        ]),
        text(' → '),
        escape(`{${pathOr([], [0, 'type', 'names'], returns).join('|')}}`)
      ]
    : []

  return h2({ class: 'title section__title' }, [escape(name), ...signature])
}

module.exports = title
