const { T, filter, join, map, pathOr, some } = require('kyanite')
const { code, escape, formatPipeList, table, tbody, td, text, th, thead, tr } = require('../engine')

/**
 * Builds the attribute labels (nullable, non-null, repeatable) for a parameter
 * @param {Object} p The parameter object
 * @returns {String} The attribute labels separated by a line break
 */
function attributes ({ nullable, variable }) {
  return join('<br>', filter(Boolean, [
    nullable === true && '&lt;nullable&gt;',
    nullable === false && '&lt;non-null&gt;',
    variable && '&lt;repeatable&gt;'
  ]))
}

/**
 * The columns a table can have, in the order they are rendered
 * - `has` decides if the column is needed for the given parameter
 * - `cell` renders the parameters value for the column
 */
const columns = [
  {
    key: 'name',
    label: 'Name',
    has: p => Boolean(p.name),
    cell: p => p.name ? code({}, [escape(p.name)]) : ''
  },
  {
    key: 'type',
    label: 'Type',
    has: T,
    cell: p => formatPipeList(pathOr([], ['type', 'names'], p))
  },
  {
    key: 'attributes',
    label: 'Attributes',
    has: p => typeof p.nullable === 'boolean' || Boolean(p.variable),
    cell: attributes
  },
  {
    key: 'optional',
    label: 'Optional?',
    has: p => Boolean(p.optional),
    cell: p => p.optional ? 'Yes' : ''
  },
  {
    key: 'defaultvalue',
    label: 'Default',
    has: p => p.defaultvalue !== undefined,
    cell: p => p.defaultvalue !== undefined ? code({}, [escape(p.defaultvalue)]) : ''
  },
  {
    key: 'description',
    label: 'Description',
    has: T,
    cell: p => text(p.description ?? '')
  }
]

/**
 * Finds the columns that at least one parameter has a value for
 * @param {Array} paramsList The array of parameters
 * @returns {Array} The columns to render
 */
function activeColumns (paramsList) {
  return filter(col => some(col.has, paramsList), columns)
}

/**
 * Responsible for controlling the flow of how our params render
 * Every row gets one cell per header so the columns always line up
 * @param {Array} paramsList The array of parameters we need to render
 * @returns {String} The html table
 */
function params (paramsList = []) {
  const cols = activeColumns(paramsList)

  return table({ class: 'params__table' }, [
    thead({ class: 'params__thead' }, [
      tr({ class: 'params__tr' }, map(({ key, label }) =>
        th({ class: `params__th params__th--${key}` }, [label]), cols))
    ]),
    tbody({ class: 'params__tbody' }, map(p =>
      tr({ class: 'params__tr' }, map(({ key, cell }) =>
        td({ class: `params__td params__td--${key}` }, [cell(p)]), cols)), paramsList))
  ])
}

module.exports = params
