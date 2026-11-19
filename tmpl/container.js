const { capitalize } = require('kyanite')
const { div, h3, p, section, text } = require('../engine')
const params = require('./params')
const title = require('./title')
const details = require('./details')
const examples = require('./example')
const { highlightBlocks } = require('../_internals/_highlight')

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
    return t === 'returns' || t === 'parameters'
      ? [
          h3({ class: `${type}__head section__title` }, [text(capitalize(t))]),
          fn(data)
        ]
      : [fn(data)]
  }

  return []
}

/**
 * Builds the description section, descriptions that already start with a block element
 * (like the output of jsdocs markdown plugin) are not wrapped in another paragraph
 * @param {String} desc The description of the doclet
 * @returns {Array} The description section, or an empty array when there is no description
 */
function description (desc = '') {
  const trimmed = highlightBlocks(desc.trim())

  if (!trimmed) {
    return []
  }

  const isBlock = /^<(p|div|ul|ol|pre|table|blockquote|h[1-6])[\s>]/i.test(trimmed)

  return [section({ class: 'description' }, [isBlock ? text(trimmed) : p({}, [text(trimmed)])])]
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
    ...description(doclet.description),
    div({ class: 'tables' }, [
      section({ class: 'params' }, optional(params, 'params', doclet.params)),
      section({ class: 'returns' }, optional(params, 'returns', doclet.returns))
    ]),
    ...optional(examples, 'examples', doclet.examples)
  ])
}

module.exports = container
