const { capitalize, concat, map } = require('kyanite')
const { ul, dl, dt, dd, li, text } = require('../engine')

function details (customTags = [], doclet) {
  const list = ['since', ...customTags]

  return dl({ class: 'details' }, map(name =>
    concat(
      dd({ class: 'details__data' }, [
        ul({ class: 'dummy' }, [
          li({}, [text(doclet[name])])
        ])
      ]),
      dt({ class: 'details__tag' }, [
        text(`${capitalize(name)}:`)
      ])
    )
  , list))
}

module.exports = details
