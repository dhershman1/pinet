const { test } = require('node:test')
const assert = require('node:assert/strict')
const { highlight, highlightBlocks } = require('../_internals/_highlight')

test('highlight -- highlights a known language', () => {
  assert.equal(highlight('const a = 1', 'javascript'), '<span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>')
})

test('highlight -- escapes but does not highlight unknown languages', () => {
  assert.equal(highlight('npm i <pkg> && echo "hi"', 'cli'), 'npm i &lt;pkg&gt; &amp;&amp; echo &quot;hi&quot;')
})

test('highlight -- guesses the language when none is given', () => {
  assert.match(highlight('function add (a, b) {\n  return a + b\n}'), /<span class="hljs-keyword">function<\/span>/)
})

test('highlightBlocks -- highlights marked style blocks', () => {
  assert.equal(
    highlightBlocks('<h1>x</h1><pre><code class="language-js">const a = 1</code></pre>'),
    '<h1>x</h1><pre><code class="hljs language-js"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span></code></pre>'
  )
})

test('highlightBlocks -- highlights jsdoc style blocks, keeping the pre attributes', () => {
  assert.equal(
    highlightBlocks('<pre class="prettyprint source lang-json"><code>{ "a": 1 }</code></pre>'),
    '<pre class="prettyprint source lang-json"><code class="hljs language-json"><span class="hljs-punctuation">{</span> <span class="hljs-attr">&quot;a&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-number">1</span> <span class="hljs-punctuation">}</span></code></pre>'
  )
})

test('highlightBlocks -- decodes entities before highlighting so they are not double escaped', () => {
  assert.equal(
    highlightBlocks('<pre class="lang-cli"><code>a &amp;&amp; b &lt;c&gt; &quot;d&quot; &#39;e&#39; &#x27;f&#x27;</code></pre>'),
    '<pre class="lang-cli"><code class="hljs language-cli">a &amp;&amp; b &lt;c&gt; &quot;d&quot; &#x27;e&#x27; &#x27;f&#x27;</code></pre>'
  )
})

test('highlightBlocks -- leaves already highlighted blocks alone', () => {
  const html = '<pre><code class="hljs javascript"><span class="hljs-keyword">const</span></code></pre>'

  assert.equal(highlightBlocks(html), html)
})

test('highlightBlocks -- handles several blocks and multi line code', () => {
  const result = highlightBlocks('<pre><code class="language-js">let a\nlet b</code></pre><p>x</p><pre><code class="language-cli">npm i</code></pre>')

  assert.equal(
    result,
    '<pre><code class="hljs language-js"><span class="hljs-keyword">let</span> a\n<span class="hljs-keyword">let</span> b</code></pre><p>x</p><pre><code class="hljs language-cli">npm i</code></pre>'
  )
})

test('highlightBlocks -- html without code blocks is unchanged', () => {
  assert.equal(highlightBlocks('<p>Use <code>add</code> here</p>'), '<p>Use <code>add</code> here</p>')
  assert.equal(highlightBlocks(), '')
})
