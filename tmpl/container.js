const { capitalize } = require('kyanite')
const { div, h3, p, section, text } = require('../engine')
const params = require('./params')
const title = require('./title')
const details = require('./details')
const examples = require('./example')

function optional (fn, type, data) {
  const t = type === 'params' ? 'parameters' : type

  if (data && data.length) {
    return t === 'returns' || t === 'parameters' ? [
      h3({ class: `${type}__head section__title` }, [text(capitalize(t))]),
      fn(data)
    ] : [fn(data)]
  }

  return []
}

// [
//   h3({ class: 'params__head section__title' }, [text('Parameters')]),
//   params(doclet.params)
// ]

function container (opts, doclet) {
  return div({ class: 'wrapper', id: doclet.name }, [
    title(doclet),
    details(opts.customTags, doclet),
    section({ class: 'description' }, [p({}, [text(doclet.description)])]),
    div({ class: 'tables' }, [
      section({ class: 'params' }, optional(params, 'params', doclet.params)),
      section({ class: 'returns' }, optional(params, 'returns', doclet.returns))
    ]),
    ...optional(examples, 'examples', doclet.examples)
  ])
}

module.exports = container
