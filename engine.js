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

// Element builders, declared on their own so `import { div } from 'pinet'` can find them as named exports
const label = compile('label')
const a = compile('a')
const div = compile('div')
const dl = compile('dl')
const dt = compile('dt')
const dd = compile('dd')
const span = compile('span')
const h1 = compile('h1')
const h2 = compile('h2')
const h3 = compile('h3')
const h4 = compile('h4')
const h5 = compile('h5')
const h6 = compile('h6')
const main = compile('main')
const p = compile('p')
const table = compile('table')
const thead = compile('thead')
const tbody = compile('tbody')
const td = compile('td')
const th = compile('th')
const tr = compile('tr')
const pre = compile('pre')
const code = compile('code')
const ul = compile('ul')
const li = compile('li')
const section = compile('section')
const aside = compile('aside')
const footer = compile('footer')
const header = compile('header')

module.exports = {
  compile,
  escape,
  img,
  text,
  formatPipeList,
  meta,
  link,
  input,
  label,
  a,
  div,
  dl,
  dt,
  dd,
  span,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  main,
  p,
  table,
  thead,
  tbody,
  td,
  th,
  tr,
  pre,
  code,
  ul,
  li,
  section,
  aside,
  footer,
  header
}
