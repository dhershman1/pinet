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
  return concat(' />', applyAttr(attr, '<img'))
}

function meta (attr) {
  return concat('>', applyAttr(attr, '<meta'))
}

function link (attr) {
  return concat('>', applyAttr(attr, '<link'))
}

function formatPipeList (list, char = '|') {
  return list.reduce((acc, str, i) => {
    acc += `${compile('span', { class: 'params__type' }, [str])}${i < list.length - 1 ? ` ${char} ` : ''}`

    return acc
  }, '')
}

module.exports = {
  compile,
  img,
  text,
  formatPipeList,
  meta,
  link,
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
  footer: compile('footer')
}
