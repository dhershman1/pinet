const { capitalize } = require('kyanite')
const { div, h3, p, text } = require('../engine')
const params = require('./params')
const title = require('./title')
const details = require('./details')
const examples = require('./example')

function optional (fn, type, data) {
  if (data && data.length) {
    return [
      h3({ class: `${type}__head` }, [text(capitalize(type))]),
      fn(data)
    ]
  }

  return []
}

function container (opts, doclet) {
  return div({ class: 'wrapper', id: doclet.name }, [
    title(doclet),
    details(opts.customTags, doclet),
    p({ class: 'description' }, [text(doclet.description)]),
    h3({ class: 'params__head' }, [text('Parameters')]),
    params(doclet.params),
    ...optional(params, 'returns', doclet.returns),
    ...optional(examples, 'examples', doclet.examples)
  ])
}

module.exports = container
