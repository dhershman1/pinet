const { test } = require('node:test')
const assert = require('node:assert/strict')
const params = require('../../tmpl/params')

// Pulls the header labels and each rows cells out of a rendered table
const headers = html => [...html.matchAll(/<th class="params__th params__th--(\w+)">/g)].map(m => m[1])
const rows = html => [...html.matchAll(/<tr class="params__tr">(.*?)<\/tr>/g)].slice(1).map(([, row]) =>
  [...row.matchAll(/<td class="params__td params__td--(\w+)">(.*?)<\/td>/g)].map(([, key, val]) => [key, val]))

test('params -- generates tables', () => {
  assert.equal(params([{ name: 'tmp', description: 'Testing 123' }]), '<table class="params__table"><thead class="params__thead"><tr class="params__tr"><th class="params__th params__th--name">Name</th><th class="params__th params__th--type">Type</th><th class="params__th params__th--description">Description</th></tr></thead><tbody class="params__tbody"><tr class="params__tr"><td class="params__td params__td--name"><code>tmp</code></td><td class="params__td params__td--type"></td><td class="params__td params__td--description">Testing 123</td></tr></tbody></table>')
  assert.equal(params([{ name: 'tmp', description: 'Testing 123', defaultvalue: 1 }]), '<table class="params__table"><thead class="params__thead"><tr class="params__tr"><th class="params__th params__th--name">Name</th><th class="params__th params__th--type">Type</th><th class="params__th params__th--defaultvalue">Default</th><th class="params__th params__th--description">Description</th></tr></thead><tbody class="params__tbody"><tr class="params__tr"><td class="params__td params__td--name"><code>tmp</code></td><td class="params__td params__td--type"></td><td class="params__td params__td--defaultvalue"><code>1</code></td><td class="params__td params__td--description">Testing 123</td></tr></tbody></table>')
})

test('params -- every row has one cell per header, in the same order', () => {
  const html = params([
    { name: 'a', type: { names: ['String'] }, description: 'first' },
    { name: 'b', type: { names: ['Number'] }, optional: true, nullable: true, defaultvalue: 2, description: 'second' },
    { name: 'c', variable: true, description: 'third' }
  ])
  const cols = headers(html)

  assert.deepEqual(cols, ['name', 'type', 'attributes', 'optional', 'defaultvalue', 'description'])
  rows(html).forEach(row => assert.deepEqual(row.map(([key]) => key), cols))
})

test('params -- keeps the Optional header when a later param is not optional', () => {
  const html = params([
    { name: 'a', optional: true, description: '' },
    { name: 'b', description: '' }
  ])

  assert.ok(headers(html).includes('optional'))
  assert.deepEqual(rows(html).map(row => row.find(([key]) => key === 'optional')[1]), ['Yes', ''])
})

test('params -- keeps falsy default values', () => {
  const html = params([
    { name: 'a', defaultvalue: 0 },
    { name: 'b', defaultvalue: false },
    { name: 'c', defaultvalue: '' },
    { name: 'd' }
  ])

  assert.deepEqual(
    rows(html).map(row => row.find(([key]) => key === 'defaultvalue')[1]),
    ['<code>0</code>', '<code>false</code>', '<code></code>', '']
  )
})

test('params -- attribute labels', () => {
  const html = params([
    { name: 'a', nullable: true },
    { name: 'b', nullable: false },
    { name: 'c', variable: true },
    { name: 'd', nullable: true, variable: true },
    { name: 'e' }
  ])

  assert.deepEqual(rows(html).map(row => row.find(([key]) => key === 'attributes')[1]), [
    '&lt;nullable&gt;',
    '&lt;non-null&gt;',
    '&lt;repeatable&gt;',
    '&lt;nullable&gt;<br>&lt;repeatable&gt;',
    ''
  ])
})

test('params -- escapes names, types, and defaults but not descriptions', () => {
  const html = params([{
    name: '<a>',
    type: { names: ['Array.<String>', 'Object'] },
    defaultvalue: '"x"',
    description: '<em>html</em>'
  }])

  assert.deepEqual(rows(html)[0], [
    ['name', '<code>&lt;a&gt;</code>'],
    ['type', '<span class="params__type">Array.&lt;String&gt;</span> | <span class="params__type">Object</span>'],
    ['defaultvalue', '<code>&quot;x&quot;</code>'],
    ['description', '<em>html</em>']
  ])
})

test('params -- return values without names leave out the Name column', () => {
  const html = params([{ type: { names: ['Boolean'] }, description: 'The result' }])

  assert.deepEqual(headers(html), ['type', 'description'])
  assert.deepEqual(rows(html)[0], [
    ['type', '<span class="params__type">Boolean</span>'],
    ['description', 'The result']
  ])
})

test('params -- missing descriptions render an empty cell instead of undefined', () => {
  assert.doesNotMatch(params([{ name: 'a' }]), /undefined/)
})

test('params -- no params renders an empty table', () => {
  assert.equal(params(), '<table class="params__table"><thead class="params__thead"><tr class="params__tr"></tr></thead><tbody class="params__tbody"></tbody></table>')
})
