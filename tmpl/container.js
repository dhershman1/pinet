const { div } = require('../engine')
const params = require('./params')
const title = require('./title')
const details = require('./details')

function container (opts, doclet) {
  return div({ class: 'wrapper' }, [
    title(doclet),
    details(opts.customTags, doclet),
    params(doclet.params)
  ])
}

module.exports = container
