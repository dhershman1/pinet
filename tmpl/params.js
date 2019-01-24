const { filter, identity, prop, compose, isNil } = require('kyanite')
const { table, thead, tbody, th, tr, td } = require('../engine')

const hasProp = n => compose(identity, prop(n))

function params ({ params }, opts) {
  return table({ class: 'params' }, [
    thead({}, [
      tr({}, filter())
    ])
  ])
}
