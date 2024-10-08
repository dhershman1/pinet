const { h2, span, text } = require('../engine')
const { addIndex, always, branch, concat, eq, map, pathOr, propOr, reduce } = require('kyanite')

/**
 * Handles building out comma delimated lists of parameters for the title
 * @param {Array} params Array of function params
 */
function paramCommaList (params) {
  if (!params.length) {
    return ''
  }

  const _reduce = addIndex(reduce)

  return _reduce((str, acc, i) => concat(`${str}${i < params.length - 1 ? ', ' : ''}`, acc), '', params)
}

/**
 * Builds out our function title for each card
 * @param {Object} param0 The doclet parameters
 * @param {String} param0.name The function name
 * @param {String} param0.kind Is the function really a function or something else
 * @param {Array} param0.params The parameters the function accepts
 * @param {Array} param0.returns What the function returns
 */
function title ({ name, kind, params = [], returns = [] }) {
  return h2({ class: 'title section__title' }, [
    text(name),
    ...branch(
      eq('function'),
      always([
        span({ class: 'title__params' }, [
          text('('),
          paramCommaList(map(propOr('', 'name'), params)),
          text(')')
        ]),
        text(' → '),
        text(`{${paramCommaList(pathOr([], ['type', 'names'], returns[0]))}}`)
      ]),
      always([span({ class: 'title__params' }, [])]),
      kind
    )
  ])
}

module.exports = title
