const { capitalize, ensureArray, filter, map, propOr, reduce } = require('kyanite')
const { a, ul, dl, dt, dd, li, code, section, span, escape, text } = require('../engine')
const _sourceFile = require('../_internals/_sourceFile')

/**
 * How each value is displayed, anything not listed here is shown as plain text
 */
const styles = {
  category: 'tag',
  kind: 'tag',
  signature: 'code',
  see: 'code',
  deprecated: 'code'
}

const wrappers = {
  tag: val => span({ class: 'tag' }, [val]),
  code: val => code({}, [val]),
  plain: val => val
}

/**
 * Turns a doclet value into display text, a bare `true` (like an empty `@deprecated` tag) becomes "Yes"
 * @param {*} val The value from the doclet
 * @returns {String} The escaped display text
 */
function display (val) {
  return val === true ? 'Yes' : escape(val)
}

/**
 * Builds the data element for a tag, each value in a list gets its own line
 * @param {String} name The tag name we are rendering
 * @param {*} value The value(s) of the tag from the doclet
 * @returns {String} The html for the data element
 */
function createDD (name, value) {
  const wrap = wrappers[propOr('plain', name, styles)]

  return dd({ class: 'details__data' }, [
    ul({ class: 'dummy' }, map(v => li({}, [wrap(display(v))]), ensureArray(value)))
  ])
}

/**
 * Builds the link to the generated source page for a doclet
 * @param {Object} doclet The doclet we are processing
 * @returns {String} The html for the data element
 */
function createSourceLink (doclet) {
  return dd({ class: 'details__data' }, [
    ul({ class: 'dummy' }, [
      li({}, [
        a({ href: _sourceFile(doclet.name), target: '_blank' }, [text('See Source')])
      ])
    ])
  ])
}

/**
 * Handles building the html block for the list of details such as Since, and Kind
 * @param {Object} opts An object of options for details
 * @param {Array} opts.customTags An array of custom tags to add to the details list
 * @param {Boolean} opts.genSources A boolean to determine if we should generate source links
 * @param {Object} doclet The doclet we are currently processing
 * @returns {String} The html for the details section
 */
function details ({ customTags = [], genSources = false }, doclet) {
  const hasValue = name => name === 'source' || ![undefined, null, false, ''].includes(doclet[name])
  const tags = filter(hasValue, [
    'since',
    'kind',
    'see',
    'deprecated',
    ...(genSources ? ['source'] : []),
    ...customTags
  ])

  const items = reduce((name, acc) => [
    ...acc,
    dt({ class: 'details__tag' }, [escape(`${capitalize(name)}:`)]),
    name === 'source' ? createSourceLink(doclet) : createDD(name, doclet[name])
  ], [], tags)

  return section({ class: 'details' }, [dl({}, items)])
}

module.exports = details
