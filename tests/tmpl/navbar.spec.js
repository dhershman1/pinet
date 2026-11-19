const { test } = require('node:test')
const assert = require('node:assert/strict')
const navbar = require('../../tmpl/navbar')

const pkg = { name: 'kyanite', version: '3.2.0' }
const links = html => [...html.matchAll(/<a class="pagenav__link" href="(.*?)">(.*?)<\/a>/g)].map(([, href, name]) => [name, href])
const items = html => [...html.matchAll(/<li class="nav__item"(.*?)>(.*?)<\/li>/g)].map(([, attrs, body]) => ({ attrs, body }))

test('navbar -- shows the package name and version', () => {
  assert.match(
    navbar([], {}, { pkg }),
    /<p class="pagenav__title"><strong>Kyanite<\/strong><span class="pagenav__version"> v3\.2\.0<\/span><\/p>/
  )
})

test('navbar -- falls back when there is no package', () => {
  assert.match(navbar([], {}, {}), /<strong>Unknown<\/strong><span class="pagenav__version"> v0\.0\.0<\/span>/)
})

test('navbar -- falls back when the package has no name or version', () => {
  // jsdoc creates this when there is no package.json in the sources
  assert.match(navbar([], {}, { pkg: { kind: 'package' } }), /<strong>Unknown<\/strong><span class="pagenav__version"> v0\.0\.0<\/span>/)
  assert.match(navbar([], {}, { pkg: { kind: 'package', name: 'pinet' } }), /<strong>Pinet<\/strong><span class="pagenav__version"> v0\.0\.0<\/span>/)
})

test('navbar -- custom links come after the default links', () => {
  assert.deepEqual(links(navbar([], { links: [{ name: 'Github', link: 'https://github.com' }] }, { pkg })), [
    ['Home', 'index.html'],
    ['Documentation', 'documentation.html'],
    ['Github', 'https://github.com']
  ])
})

test('navbar -- adds a changelog link when there is a changelog', () => {
  assert.deepEqual(links(navbar([], {}, { pkg, changelog: './CHANGELOG.md' })).map(([name]) => name), ['Home', 'Documentation', 'Changelog'])
})

test('navbar -- renders a nav item per function', () => {
  const result = items(navbar([{ name: 'addIndex', cat: 'Function' }, { name: 'VERSION' }], {}, { pkg }))

  assert.deepEqual(result, [
    {
      attrs: ' data-cat="Function" data-name="addIndex"',
      body: '<a class="nav__link" href="documentation.html#addIndex"><span class="nav__name">addIndex</span><span class="nav__type tag">Function</span></a>'
    },
    {
      attrs: ' data-cat="" data-name="VERSION"',
      body: '<a class="nav__link" href="documentation.html#VERSION"><span class="nav__name">VERSION</span></a>'
    }
  ])
})

test('navbar -- escapes names and encodes links', () => {
  const [item] = items(navbar([{ name: 'a<b>', cat: '"c"' }], {}, { pkg }))

  assert.equal(item.attrs, ' data-cat="&quot;c&quot;" data-name="a&lt;b&gt;"')
  assert.match(item.body, /href="documentation\.html#a%3Cb%3E"/)
  assert.match(item.body, /<span class="nav__name">a&lt;b&gt;<\/span>/)
})

test('navbar -- includes the search filter', () => {
  assert.match(navbar([], {}, { pkg }), /<input class="filter" type="text" id="pinetFilter" placeholder="Search Category or Function name"><\/input>/)
})
