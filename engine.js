const { concat, reduce } = require('kyanite')
const _curry3 = require('./_internals/_curry3')

const compile = _curry3((name, attr, children) => {
  const el = concat('>', reduce(([k, v], html) =>
    concat(` ${k}="${v}"`, html), `<${name}`, Object.entries(attr)))

  return concat(`</${name}>`, reduce(concat, el, children))
})

function text (val) {
  return val
}

module.exports = {
  text,
  compile,
  main: compile('main'),
  h1: compile('h1'),
  p: compile('p')
}
