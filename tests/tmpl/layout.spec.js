const { test } = require('node:test')
const assert = require('node:assert/strict')
const layout = require('../../tmpl/layout')

const extras = { pkg: { name: 'pinet', version: '2.0.0' } }

test('layout -- renders a full html page', () => {
  const html = layout({})([], [], extras)

  assert.match(html, /^<!DOCTYPE html><html lang="en"><head>/)
  assert.match(html, /<title>Documentation<\/title>/)
  assert.match(html, /<link href="static\/css\/main\.css" rel="stylesheet"><link href="static\/css\/hl\.css" rel="stylesheet">/)
  assert.match(html, /<script src="static\/js\/search\.js"><\/script><\/div><\/body><\/html>$/)
})

test('layout -- does not load anything from a cdn', () => {
  assert.doesNotMatch(layout({})([], [], extras), /https?:\/\/(?!github\.com)/)
})

test('layout -- uses the title, language, and meta options', () => {
  const html = layout({
    title: 'My <Docs>',
    lang: 'fr',
    meta: [{ charset: 'UTF-8' }, { name: 'description', content: 'Docs' }]
  })([], [], extras)

  assert.match(html, /<html lang="fr">/)
  assert.match(html, /<title>My &lt;Docs&gt;<\/title>/)
  assert.match(html, /<head><meta charset="UTF-8"><meta name="description" content="Docs"><title>/)
})

test('layout -- renders children into main', () => {
  assert.match(layout({})(['<div>one</div>', '<div>two</div>'], [], extras), /<main><div>one<\/div><div>two<\/div><\/main>/)
})

test('layout -- renders a page of html into a wrapper instead of the children', () => {
  const html = layout({})(['<div>ignored</div>'], [], extras, '<h1>Readme</h1>')

  assert.match(html, /<main><div class="wrapper"><h1>Readme<\/h1><\/div><\/main>/)
  assert.doesNotMatch(html, /ignored/)
})

test('layout -- highlights code blocks in a page of html', () => {
  const html = layout({})([], [], extras, '<pre class="prettyprint source lang-js"><code>const a = 1</code></pre>')

  assert.match(html, /<code class="hljs language-js"><span class="hljs-keyword">const<\/span>/)
})

test('layout -- renders the nav', () => {
  const html = layout({ links: [{ name: 'Github', link: 'https://github.com/x' }] })([], [{ name: 'add', cat: 'Math' }], extras)

  assert.match(html, /<aside class="side-nav">/)
  assert.match(html, /data-name="add"/)
  assert.match(html, /href="https:\/\/github\.com\/x"/)
})
