const { h3, span, text } = require('../engine')
const { addIndex, concat, reduce, map, prop } = require('kyanite')

function paramCommaList (params) {
  const _reduce = addIndex(reduce)

  return _reduce((str, acc, i) => concat(`${str}${i < params.length - 1 ? `, ` : ''}`, acc), '', params)
}

function title ({ name, params, returns }) {
  return h3({ class: 'title' }, [
    text(name),
    span({ class: 'title__params' }, [
      text('('),
      paramCommaList(map(prop('name'), params)),
      text(')')
    ]),
    text(' → '),
    text(`{${paramCommaList(returns[0].type.names)}}`)
  ])
}

module.exports = title
