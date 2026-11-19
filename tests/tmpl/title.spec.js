const { test } = require('node:test')
const assert = require('node:assert/strict')
const title = require('../../tmpl/title')

test('title -- renders a function signature', () => {
  assert.equal(
    title({ name: 'add', kind: 'function', params: [{ name: 'a' }, { name: 'b' }], returns: [{ type: { names: ['Number'] } }] }),
    '<h2 class="title section__title">add<span class="title__params">(a, b)</span> → {Number}</h2>'
  )
})

test('title -- separates multiple return types with a pipe', () => {
  assert.match(title({ name: 'f', kind: 'function', returns: [{ type: { names: ['String', 'Number'] } }] }), /→ \{String\|Number\}/)
})

test('title -- handles functions without params or returns', () => {
  assert.equal(title({ name: 'noop', kind: 'function' }), '<h2 class="title section__title">noop<span class="title__params">()</span> → {}</h2>')
})

test('title -- non functions only show their name', () => {
  assert.equal(title({ name: 'VERSION', kind: 'constant' }), '<h2 class="title section__title">VERSION</h2>')
})

test('title -- escapes names and types', () => {
  assert.equal(
    title({ name: '<x>', kind: 'function', params: [{ name: '<a>' }], returns: [{ type: { names: ['Array.<String>'] } }] }),
    '<h2 class="title section__title">&lt;x&gt;<span class="title__params">(&lt;a&gt;)</span> → {Array.&lt;String&gt;}</h2>'
  )
})
