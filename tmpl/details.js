const { capitalize, concat, map } = require('kyanite')
const { dl, dt, dd, text } = require('../engine')

function details (customTags = [], doclet) {
  const list = ['since', ...customTags]

  return dl({ class: 'details' }, map(name =>
    concat(
      dd({ class: 'details__data' }, [
        text(doclet[name])
      ]),
      dt({ class: 'details__tag' }, [
        text(`${capitalize(name)}:`)
      ])
    )
  , list))
}

module.exports = details
