const { capitalize } = require('kyanite')
const { div, h3, p, section, text } = require('../engine')
const params = require('./params')
const title = require('./title')
const details = require('./details')
const examples = require('./example')

/**
 * Responsible for creating containers to contain the other html modules
 */

/**
 * Marks an html module as optional keeping the flow consistent but not showing fields that do not exist
 * @param {Function} fn A Predicate function to run
 * @param {String} type What type of element is being
 * @param {Object} data The data to run within the predicate function
 */
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

/**
 * Handles wrapping html elements within a container to keep flow consistent
 * @param {Object} opts The Options passed from our layout
 * @param {Object} doclet The current doclet we are processing
 */
function container (opts, doclet) {
  return div({ class: 'wrapper', id: doclet.name }, [
    title(doclet),
    details(opts, doclet),
    section({ class: 'description' }, [p({}, [text(doclet.description)])]),
    div({ class: 'tables' }, [
      section({ class: 'params' }, optional(params, 'params', doclet.params)),
      section({ class: 'returns' }, optional(params, 'returns', doclet.returns))
    ]),
    ...optional(examples, 'examples', doclet.examples)
  ])
}

module.exports = container
