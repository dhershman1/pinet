const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const source = require('../../tmpl/source')

const fixtures = path.join(__dirname, '..', 'fixtures', 'src')

test('source -- builds a highlighted page for the whole file', async () => {
  const result = await source({ name: 'add', meta: { path: fixtures, filename: 'add.js' } })

  assert.equal(result.name, 'add')
  assert.match(result.html, /^<div class="source__wrapper"><h2 class="source__header">add<\/h2><pre class="source__code"><code class="hljs javascript">/)
  // Keywords from across the file are highlighted, not just the first few characters
  assert.match(result.html, /<span class="hljs-keyword">function<\/span>/)
  assert.match(result.html, /<span class="hljs-keyword">return<\/span>/)
  assert.match(result.html, /<span class="hljs-variable language_">module<\/span>/)
})

test('source -- escapes the name', async () => {
  const result = await source({ name: '<add>', meta: { path: fixtures, filename: 'add.js' } })

  assert.match(result.html, /<h2 class="source__header">&lt;add&gt;<\/h2>/)
})

test('source -- resolves null for files that cannot be read', async t => {
  const errors = t.mock.method(console, 'error', () => {})
  const result = await source({ name: 'missing', meta: { path: fixtures, filename: 'missing.js' } })

  assert.equal(result, null)
  assert.match(errors.mock.calls[0].arguments[0], /Could not read the source for missing/)
})
