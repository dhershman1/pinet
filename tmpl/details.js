const { always, branch, capitalize, compose, concat, eq, pipe, reduced, when, map } = require('kyanite/dist/kyanite')
const { ul, dl, dt, dd, li, code, span, text } = require('../engine')

function details (customTags = [], doclet) {
  const list = ['since', ...customTags]
  const done = compose(reduced)

  const createDD = isCode => n => {
    const txt = text(doclet[n])
    return dd({ class: 'details__data' }, [
      ul({ class: 'dummy' }, [
        li({}, [
          branch(
            always(isCode),
            () => code({}, [txt]),
            () => eq(n, 'category') ? span({ class: 'tag' }, [txt]) : txt,
            txt
          )
        ])
      ])
    ])
  }

  return dl({ class: 'details' }, map(name => {

    return concat(
      pipe([
        when(eq('category'), done(createDD(false))),
        when(eq('signature'), done(createDD(true))),
        createDD(false)
      ], name),
      dt({ class: 'details__tag' }, [
        text(`${capitalize(name)}:`)
      ])
    )
  }
  , list))
}

module.exports = details
