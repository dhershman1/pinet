const { concat, reduce } = require('kyanite')
const _curry3 = require('./_internals/_curry3')

const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

/**
 * Escapes a value so it can be safely placed in html as plain text or as an attribute value
 * @param {*} val The value to escape, anything that isn't a string is converted to one
 * @returns {String} The escaped string, `null` and `undefined` become an empty string
 */
function escape (val) {
  return String(val ?? '').replace(/[&<>"']/g, ch => escapeMap[ch])
}

function applyAttr (attr, acc) {
  return reduce(([k, v], html) => concat(` ${k}="${escape(v)}"`, html), acc, Object.entries(attr))
}

const compile = _curry3((name, attr, children) => {
  const el = concat('>', applyAttr(attr, `<${name}`))

  return concat(`</${name}>`, reduce(concat, el, children))
})

/**
 * Passes html through untouched, use `escape` for values that should be treated as plain text
 * @param {String} val The html string
 * @returns {String} The same html string
 */
function text (val) {
  return val
}

function img (attr) {
  return concat(' />', applyAttr(attr, '<img'))
}

function meta (attr) {
  return concat('>', applyAttr(attr, '<meta'))
}

function link (attr) {
  return concat('>', applyAttr(attr, '<link'))
}

function input (attr) {
  return concat('>', applyAttr(attr, '<input'))
}

function formatPipeList (list, char = '|') {
  return list
    .map(str => compile('span', { class: 'params__type' }, [escape(str)]))
    .join(` ${char} `)
}

module.exports = {
  compile,
  escape,
  img,
  text,
  formatPipeList,
  meta,
  link,
  input,
  label: compile('label'),
  a: compile('a'),
  div: compile('div'),
  dl: compile('dl'),
  dt: compile('dt'),
  dd: compile('dd'),
  span: compile('span'),
  h1: compile('h1'),
  h2: compile('h2'),
  h3: compile('h3'),
  h4: compile('h4'),
  h5: compile('h5'),
  h6: compile('h6'),
  main: compile('main'),
  p: compile('p'),
  table: compile('table'),
  thead: compile('thead'),
  tbody: compile('tbody'),
  td: compile('td'),
  th: compile('th'),
  tr: compile('tr'),
  pre: compile('pre'),
  code: compile('code'),
  ul: compile('ul'),
  li: compile('li'),
  section: compile('section'),
  aside: compile('aside'),
  footer: compile('footer'),
  header: compile('header')
}
