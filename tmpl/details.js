const {
  always,
  branch,
  capitalize,
  compose,
  concat,
  either,
  eq,
  pipe,
  prop,
  reduce,
  reduced,
  when
} = require('kyanite')
const { ul, dl, dt, dd, li, code, section, span, text } = require('../engine')
const _appendǃ = require('../_internals/_appendǃ')
const _curry3 = require('../_internals/_curry3')

const createDD = _curry3(function (doclet, highlight, n) {
  const value = text(doclet[n])

  return dd({ class: 'details__data' }, [
    ul({ class: 'dummy' }, [
      li({}, [
        branch(
          always(highlight),
          () => code({}, [value]),
          () => either(eq('category'), eq('kind'), n) ? span({ class: 'tag' }, [value]) : value,
          value
        )
      ])
    ])
  ])
})

function details (customTags = [], doclet) {
  const dd = createDD(doclet)
  const list = ['since', 'kind', ...customTags]
  const done = compose(reduced)

  return section({ class: 'details' }, [dl({}, reduce((name, acc) => {
    if (prop(name, doclet)) {
      return _appendǃ(acc, concat(
        pipe([
          when(
            eq('category'),
            done(dd(false))
          ),
          when(
            eq('signature'),
            done(dd(true))
          ),
          when(
            eq('kind'),
            done(dd(false))
          ),
          when(
            eq('since'),
            done(dd(false))
          )
        ], name),
        dt({ class: 'details__tag' }, [
          text(`${capitalize(name)}:`)
        ])
      ))
    }

    return acc
  }
  , [], list))])
}

module.exports = details
