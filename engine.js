const { concat, reduce } = require('kyanite')
const _curry3 = require('./_internals/_curry3')

function applyAttr (attr, acc) {
  return reduce(([k, v], html) => concat(` ${k}="${v}"`, html), acc, Object.entries(attr))
}

const compile = _curry3((name, attr, children) => {
  const el = concat('>', applyAttr(attr, `<${name}`))

  return concat(`</${name}>`, reduce(concat, el, children))
})

function text (val) {
  return val
}

function img (attr) {
  return concat(' />', applyAttr(attr, `<${name}`))
}

module.exports = {
  compile,
  img,
  text,
  div: compile('div'),
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
  tr: compile('tr')
}
