const {
  always,
  branch,
  compose,
  concat,
  either,
  eq,
  ensureArray,
  identity,
  map,
  prop,
  pipe,
  plan,
  prepend,
  reduce,
  reduced,
  some,
  when,
  whole
} = require('kyanite')
const { code, formatPipeList, table, tbody, td, text, th, thead, tr } = require('../engine')

// This can probably be replaced now
function findValidHeaders (params) {
  const validate = whole({
    hasName: identity,
    hasAttrs: identity,
    isOptional: identity,
    hasDefault: identity
  })
  const passes = some(identity)

  return reduce((val, acc) => {
    if (validate(acc)) {
      return reduced(acc)
    }

    return Object.assign({}, acc, {
      hasName: passes([acc.hasName, val.name]),
      hasAttrs: passes([acc.hasAttrs, val.nullable, val.variable]),
      isOptional: passes([acc.optional, val.optional]),
      hasDefault: passes([acc.hasDefault, typeof val.defaultvalue !== 'undefined'])
    })
  }, {
      hasName: false,
      hasAttrs: false,
      isOptional: false,
      hasDefault: false
    }, params)
}

function buildTableHeaders (params, _th) {
  const { hasName, hasAttrs, isOptional, hasDefault } = findValidHeaders(params)

  return pipe([
    when(always(hasName), prepend(th({ class: 'params__th params__th--name' }, [text('Name')]))),
    when(always(hasAttrs), concat(th({ class: 'params__th params__th--attributes' }, [text('Attributes')]))),
    when(always(isOptional), concat(th({ class: 'params__th params__th--optional' }, [text('Optional?')]))),
    when(always(hasDefault), concat(th({ class: 'params__th params__th--default' }, [text('Default')]))),
    concat(th({ class: 'params__th params__th--description' }, [text('Description')]))
  ], [th({ class: 'params__th params__th--type' }, [text('Type')])])
}

function buildTableData (p) {
  // Sorts and filters out the data so it follows the same order as our table heads
  const sortedData = reduce((k, acc) => {
    if (p[k]) {
      return branch(
        either(eq('nullable'), eq('variable')),
        x => Object.assign({}, acc, { attributes: p[x] }),
        x => Object.assign({}, acc, { [x]: p[x] }),
        k
      )
    }

    return acc
  }, {}, ['name', 'type', 'nullable', 'variable', 'optional', 'defaultvalue', 'description'])

  return Object.values(plan({
    name: x => {
      const val = ensureArray(x)
      // compose(td({ class: 'params__td params__td--name' }), ensureArray)
      return td({ class: 'params__td params__td--name' }, [code({}, val)])
    },
    type: when(prop('names'), pipe([prop('names'), formatPipeList, td({ class: 'params__td params__td--type' })])),
    nullable: when(identity, compose(td({ class: 'params__td params__td--nullable' }), ensureArray)),
    variable: when(identity, compose(td({ class: 'params__td params__td--variable' }), ensureArray)),
    optional: compose(td({ class: 'params__td--optional' }), ensureArray),
    defaultvalue: when(identity, compose(td({ class: 'params__td params__td--defaultvalue' }), ensureArray)),
    description: when(identity, compose(td({ class: 'params__td params__td--description' }), ensureArray))
  }, sortedData))
}

function params (params) {
  return table({ class: 'params__table' }, [
    thead({ class: 'params__thead' }, [
      tr({ class: 'params__tr' }, buildTableHeaders(params, th({ class: 'params__th' })))
    ]),
    tbody({ class: 'params__tbody' }, map(p => {
      return tr({ class: 'params__tr' }, buildTableData(p))
    }, params))
  ])
}

module.exports = params
