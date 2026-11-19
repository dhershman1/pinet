const { test } = require('node:test')
const assert = require('node:assert/strict')
const engine = require('../engine')

const { compile, escape, formatPipeList, h1, img, input, link, main, meta, text } = engine

test('engine -- handles basic html types', () => {
  assert.equal(main({ data: 'foo', id: 'bar' }, []), '<main data="foo" id="bar"></main>')
  assert.equal(h1({ data: 'foo', id: 'bar' }, []), '<h1 data="foo" id="bar"></h1>')
})

test('engine -- handles html with children', () => {
  assert.equal(h1({ data: 'foo', id: 'bar' }, [text('Pretty Pony')]), '<h1 data="foo" id="bar">Pretty Pony</h1>')
  assert.equal(main({}, [h1({}, ['a']), h1({}, ['b'])]), '<main><h1>a</h1><h1>b</h1></main>')
})

test('engine -- compile is curried', () => {
  const strong = compile('strong')

  assert.equal(typeof strong, 'function')
  assert.equal(typeof compile('strong', {}), 'function')
  assert.equal(strong({}, ['hi']), '<strong>hi</strong>')
  assert.equal(compile('strong')({})(['hi']), '<strong>hi</strong>')
  assert.equal(compile('strong', {}, ['hi']), '<strong>hi</strong>')
})

test('engine -- escapes attribute values', () => {
  assert.equal(compile('div', { title: 'a "b" <c> & \'d\'' }, []), '<div title="a &quot;b&quot; &lt;c&gt; &amp; &#39;d&#39;"></div>')
})

test('engine -- void elements', () => {
  assert.equal(img({ src: 'a.png', alt: 'A' }), '<img src="a.png" alt="A" />')
  assert.equal(meta({ charset: 'UTF-8' }), '<meta charset="UTF-8">')
  assert.equal(link({ href: 'a.css', rel: 'stylesheet' }), '<link href="a.css" rel="stylesheet">')
  assert.equal(input({ type: 'checkbox' }), '<input type="checkbox">')
})

test('engine -- text passes html through untouched', () => {
  assert.equal(text('<b>bold</b>'), '<b>bold</b>')
})

test('engine -- escape turns values into safe text', () => {
  assert.equal(escape('<b>"Tom" & \'Jerry\'</b>'), '&lt;b&gt;&quot;Tom&quot; &amp; &#39;Jerry&#39;&lt;/b&gt;')
  assert.equal(escape(0), '0')
  assert.equal(escape(false), 'false')
  assert.equal(escape(null), '')
  assert.equal(escape(undefined), '')
  assert.equal(escape('plain'), 'plain')
})

test('engine -- formatPipeList', () => {
  assert.equal(formatPipeList(['String']), '<span class="params__type">String</span>')
  assert.equal(
    formatPipeList(['String', 'Array.<String>']),
    '<span class="params__type">String</span> | <span class="params__type">Array.&lt;String&gt;</span>'
  )
  assert.equal(
    formatPipeList(['a', 'b'], ','),
    '<span class="params__type">a</span> , <span class="params__type">b</span>'
  )
  assert.equal(formatPipeList([]), '')
})

test('engine -- exports an element builder for every tag the templates use', () => {
  const tags = [
    'label', 'a', 'div', 'dl', 'dt', 'dd', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'main', 'p',
    'table', 'thead', 'tbody', 'td', 'th', 'tr', 'pre', 'code', 'ul', 'li', 'section', 'aside', 'footer', 'header'
  ]

  tags.forEach(tag => {
    assert.equal(engine[tag]({}, []), `<${tag}></${tag}>`, `${tag} renders`)
  })
})
