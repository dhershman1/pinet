const { test } = require('node:test')
const assert = require('node:assert/strict')
const container = require('../../tmpl/container')

const doclet = {
  name: 'add',
  kind: 'function',
  description: 'Adds two numbers',
  params: [{ name: 'a', type: { names: ['Number'] } }, { name: 'b', type: { names: ['Number'] } }],
  returns: [{ type: { names: ['Number'] } }],
  examples: ['add(1, 2) // => 3']
}

const description = html => (/<section class="description">(.*?)<\/section>/s.exec(html) || [])[1]

test('container -- wraps a doclet in a wrapper with its name as the id', () => {
  assert.match(container({}, doclet), /^<div class="wrapper" id="add"><h2 class="title section__title">add/)
})

test('container -- renders the sections in order', () => {
  const html = container({}, doclet)
  const order = ['class="title', 'class="details"', 'class="description"', 'class="params__head', 'class="returns__head', '<pre>']
  const positions = order.map(str => html.indexOf(str))

  positions.forEach((pos, i) => assert.ok(pos > -1, `${order[i]} is rendered`))
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b))
})

test('container -- wraps plain descriptions in a paragraph', () => {
  assert.equal(description(container({}, doclet)), '<p>Adds two numbers</p>')
})

test('container -- does not wrap html descriptions in another paragraph', () => {
  ['<p>Already a paragraph</p>', '<ul><li>a</li></ul>', '  <p>Leading space</p>'].forEach(desc => {
    assert.equal(description(container({}, { ...doclet, description: desc })), desc.trim())
  })
})

test('container -- leaves out a missing description', () => {
  const html = container({}, { ...doclet, description: undefined })

  assert.doesNotMatch(html, /class="description"/)
  assert.doesNotMatch(html, /undefined/)
  assert.doesNotMatch(container({}, { ...doclet, description: '   ' }), /class="description"/)
})

test('container -- highlights code blocks in markdown descriptions', () => {
  const html = container({}, { ...doclet, description: '<pre class="prettyprint source lang-js"><code>const a = 1</code></pre>' })

  assert.match(description(html), /<code class="hljs language-js"><span class="hljs-keyword">const<\/span>/)
})

test('container -- leaves out params, returns, and examples when there are none', () => {
  const html = container({}, { name: 'VERSION', kind: 'constant', description: 'The version' })

  assert.match(html, /<section class="params"><\/section><section class="returns"><\/section>/)
  assert.doesNotMatch(html, /<pre>/)
  assert.doesNotMatch(html, /undefined/)
})

test('container -- passes options on to details', () => {
  assert.match(container({ genSources: true }, doclet), /See Source/)
})
