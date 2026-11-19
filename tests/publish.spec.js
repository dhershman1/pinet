const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { execFile } = require('node:child_process')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')

const root = path.join(__dirname, '..')
const fixtures = path.join(__dirname, 'fixtures')
const jsdoc = require.resolve('jsdoc/jsdoc.js')
let tmp

/**
 * Runs jsdoc with pinet as the template, resolving with the exit code and output instead of throwing
 * @param {String} name A name for this build, used for its config and output folder
 * @param {Object} pinet The pinet options to build with
 * @param {Object} [opts] Extra jsdoc opts
 * @returns {Promise<Object>} The exit code, output, and destination of the build
 */
async function build (name, pinet, opts = {}) {
  const destination = path.join(tmp, name)
  const config = path.join(tmp, `${name}.json`)

  await fs.writeFile(config, JSON.stringify({
    source: { include: [path.join(fixtures, 'src')] },
    plugins: ['plugins/markdown', path.join(root, 'tags.js')],
    opts: { template: root, destination, readme: path.join(fixtures, 'README.md'), ...opts },
    pinet: { title: 'Fixture Docs', genSources: true, customTags: ['category', 'signature'], ...pinet }
  }))

  return new Promise(resolve => {
    execFile(process.execPath, [jsdoc, '-c', config], { cwd: root }, (err, stdout, stderr) => {
      resolve({ code: err ? err.code : 0, stdout, stderr, destination })
    })
  })
}

const read = (dir, file) => fs.readFile(path.join(dir, file), 'utf8')

before(async () => {
  tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'pinet-'))
})

after(() => fs.rm(tmp, { recursive: true, force: true }))

test('publish -- builds every page', async () => {
  const { code, stderr, destination } = await build('full', { changelog: path.join(fixtures, 'CHANGELOG.md') })
  const files = await fs.readdir(destination)

  assert.equal(code, 0, stderr)
  assert.deepEqual(files.sort(), ['add.html', 'changelog.html', 'documentation.html', 'index.html', 'isNil.html', 'static'])
  assert.deepEqual((await fs.readdir(path.join(destination, 'static'), { recursive: true })).sort(), [
    'css', 'css/hl.css', 'css/main.css', 'js', 'js/search.js'
  ])
})

test('publish -- documentation page renders every doclet', async () => {
  const html = await read(path.join(tmp, 'full'), 'documentation.html')

  assert.match(html, /<title>Fixture Docs<\/title>/)
  assert.match(html, /<div class="wrapper" id="add">/)
  assert.match(html, /<div class="wrapper" id="isNil">/)
  assert.match(html, /<span class="tag">Math<\/span>/)
  assert.match(html, /<code>Number -&gt; Number -&gt; Number<\/code>/)
  assert.match(html, /<td class="params__td params__td--defaultvalue"><code>0<\/code><\/td>/)
  assert.match(html, /href="changelog.html"/)
  // The fixtures mention `undefined` in their text and code, so only look for it as a stray value
  assert.doesNotMatch(html, /(?<!<code)>\s*undefined\s*</)
})

test('publish -- markdown descriptions are not nested in paragraphs and their code is highlighted', async () => {
  const html = await read(path.join(tmp, 'full'), 'documentation.html')
  const [, desc] = /<div class="wrapper" id="isNil">.*?<section class="description">(.*?)<\/section>/s.exec(html)

  assert.doesNotMatch(html, /<p>\s*<(p|ul|pre)[\s>]/)
  assert.match(desc, /^<p>Checks if a value is <code>null<\/code>/)
  assert.match(desc, /<ul>/)
  assert.match(desc, /<code class="hljs language-js">/)
})

test('publish -- readme, changelog, and source pages are highlighted', async () => {
  const dir = path.join(tmp, 'full')

  assert.match(await read(dir, 'index.html'), /<code class="hljs language-json">/)
  assert.match(await read(dir, 'changelog.html'), /<code class="hljs language-js"><span class="hljs-keyword">const<\/span>/)
  assert.match(await read(dir, 'add.html'), /<h2 class="source__header">add<\/h2>.*<span class="hljs-keyword">return<\/span>/s)
})

test('publish -- a missing changelog is reported and the build still finishes', async () => {
  const { code, stdout, stderr, destination } = await build('nochangelog', { changelog: path.join(fixtures, 'NOPE.md') })

  assert.equal(code, 0, stderr)
  assert.match(stderr, /Changelog could not be found at .*NOPE\.md/)
  assert.match(stdout, /Write Finished/)
  assert.ok((await fs.readdir(destination)).includes('documentation.html'))
  assert.ok(!(await fs.readdir(destination)).includes('changelog.html'))
})

test('publish -- skips source pages when genSources is off', async () => {
  const { code, stderr, destination } = await build('nosources', { genSources: false })

  assert.equal(code, 0, stderr)
  assert.deepEqual((await fs.readdir(destination)).sort(), ['documentation.html', 'index.html', 'static'])
  assert.doesNotMatch(await read(destination, 'documentation.html'), /See Source/)
})

test('publish -- a failed build exits with a failure code', async () => {
  const blocked = path.join(tmp, 'blocked')

  // A file where the destination folder should be makes every write fail
  await fs.writeFile(blocked, '')

  const { code, stderr } = await build('blocked', {})

  assert.equal(code, 1)
  assert.match(stderr, /Pinet failed to write the documentation/)
})
