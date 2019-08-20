const { h2, span, text } = require('../engine')
const { addIndex, always, branch, concat, eq, map, pathOr, propOr, reduce } = require('kyanite')

function paramCommaList (params) {
  if (!params.length) {
    return ''
  }

  const _reduce = addIndex(reduce)

  return _reduce((str, acc, i) => concat(`${str}${i < params.length - 1 ? ', ' : ''}`, acc), '', params)
}

function pipeList (list) {

}

function title ({ name, kind, params = [], returns = [] }) {
  // console.log(returns)
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
