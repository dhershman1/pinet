const { test } = require('node:test')
const assert = require('node:assert/strict')
const details = require('../../tmpl/details')

// Pulls each tag and the values listed under it out of the rendered details
const entries = html => [...html.matchAll(/<dt class="details__tag">(.*?)<\/dt><dd class="details__data"><ul class="dummy">(.*?)<\/ul><\/dd>/g)]
  .map(([, tag, list]) => [tag, [...list.matchAll(/<li>(.*?)<\/li>/g)].map(m => m[1])])

test('details -- renders the built in tags in order', () => {
  const html = details({}, { since: 'v1.0.0', kind: 'function', see: 'add', deprecated: 'Use add' })

  assert.deepEqual(entries(html), [
    ['Since:', ['v1.0.0']],
    ['Kind:', ['<span class="tag">function</span>']],
    ['See:', ['<code>add</code>']],
    ['Deprecated:', ['<code>Use add</code>']]
  ])
})

test('details -- wraps everything in a details section', () => {
  assert.equal(details({}, {}), '<section class="details"><dl></dl></section>')
})

test('details -- skips tags without a value', () => {
  const html = details({}, { since: '', kind: 'function', see: null, deprecated: false })

  assert.deepEqual(entries(html).map(([tag]) => tag), ['Kind:'])
})

test('details -- lists each value of a multi value tag on its own line', () => {
  const html = details({}, { see: ['add', 'subtract'] })

  assert.deepEqual(entries(html), [['See:', ['<code>add</code>', '<code>subtract</code>']]])
})

test('details -- an empty deprecated tag shows Yes', () => {
  assert.deepEqual(entries(details({}, { deprecated: true })), [['Deprecated:', ['<code>Yes</code>']]])
})

test('details -- custom tags render their values with their style', () => {
  const html = details({ customTags: ['category', 'signature', 'recipe'] }, {
    category: 'Array',
    signature: ['a -> b', 'b -> c'],
    recipe: ['step one']
  })

  assert.deepEqual(entries(html), [
    ['Category:', ['<span class="tag">Array</span>']],
    ['Signature:', ['<code>a -&gt; b</code>', '<code>b -&gt; c</code>']],
    ['Recipe:', ['step one']]
  ])
})

test('details -- escapes values', () => {
  assert.deepEqual(entries(details({}, { since: '<b>1</b>' })), [['Since:', ['&lt;b&gt;1&lt;/b&gt;']]])
})

test('details -- adds a source link when generating sources', () => {
  const html = details({ genSources: true }, { name: 'add', since: 'v1.0.0' })

  assert.match(html, /<dt class="details__tag">Source:<\/dt><dd class="details__data"><ul class="dummy"><li><a href="add.html" target="_blank">See Source<\/a><\/li><\/ul><\/dd>/)
  assert.doesNotMatch(details({}, { name: 'add' }), /See Source/)
})

test('details -- source comes before custom tags', () => {
  const html = details({ genSources: true, customTags: ['category'] }, { name: 'add', category: 'Math' })
  const tags = [...html.matchAll(/<dt class="details__tag">(.*?)<\/dt>/g)].map(m => m[1])

  assert.deepEqual(tags, ['Source:', 'Category:'])
})
