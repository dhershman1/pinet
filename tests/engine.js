const test = require('tape')
const { main, h1, text } = require('../engine')

test('engine -- handles basic html types', t => {
  console.log(h1({ data: 'foo', id: 'bar' }, [text('Pretty Pony')]))

  t.same(main({ data: 'foo', id: 'bar' }, []), '<main data="foo" id="bar"></main>')
  t.same(h1({ data: 'foo', id: 'bar' }, []), '<h1 data="foo" id="bar"></h1>')
  t.end()
})

test('engine -- handles html with children', t => {
  t.same(h1({ data: 'foo', id: 'bar' }, [text('Pretty Pony')]), '<h1 data="foo" id="bar">Pretty Pony</h1>')
  t.end()
})
