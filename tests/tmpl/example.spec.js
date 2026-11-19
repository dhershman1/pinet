const { test } = require('node:test')
const assert = require('node:assert/strict')
const examples = require('../../tmpl/example')

test('examples -- highlights an example', () => {
  assert.equal(
    examples(['const a = 1']),
    '<pre><code class="hljs javascript"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span></code></pre>'
  )
})

test('examples -- puts each example on its own line', () => {
  assert.equal(
    examples(['a()', 'b()']),
    '<pre><code class="hljs javascript"><span class="hljs-title function_">a</span>()\n<span class="hljs-title function_">b</span>()</code></pre>'
  )
})

test('examples -- escapes html in examples', () => {
  assert.match(examples(['"<b>"']), /&lt;b&gt;/)
})

test('examples -- no examples renders an empty block', () => {
  assert.equal(examples(), '<pre><code class="hljs javascript"></code></pre>')
})
