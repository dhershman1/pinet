const { div } = require('../engine')
const params = require('./params')
const title = require('./title')

function container (opts, doclet) {
  console.log(doclet)
  return div({ class: 'wrapper' }, [
    title(doclet),
    params(doclet.params)
  ])
}

module.exports = container
