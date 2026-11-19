const { test } = require('node:test')
const assert = require('node:assert/strict')
const { defineTags } = require('../tags')

// A tiny stand in for jsdocs tag dictionary that records each definition
function defineAll () {
  const defs = {}

  defineTags({ defineTag: (name, def) => { defs[name] = def } })

  return defs
}

function tagged (def, value) {
  const doclet = {}

  def.onTagged(doclet, { value })

  return doclet
}

test('tags -- defines the built in custom tags', () => {
  const defs = defineAll()

  assert.deepEqual(Object.keys(defs).sort(), ['category', 'recipe', 'sig', 'signature'])
  Object.values(defs).forEach(def => assert.equal(def.mustHaveValue, true))
})

test('tags -- category is stored as is', () => {
  assert.deepEqual(tagged(defineAll().category, 'Array'), { category: 'Array' })
})

test('tags -- sig and signature both store a list of lines on signature', () => {
  const { sig, signature } = defineAll()

  assert.deepEqual(tagged(signature, 'a -> b\nb -> c'), { signature: ['a -> b', 'b -> c'] })
  assert.deepEqual(tagged(sig, 'a -> b'), { signature: ['a -> b'] })
})

test('tags -- recipe stores a list of lines', () => {
  assert.deepEqual(tagged(defineAll().recipe, 'one\ntwo'), { recipe: ['one', 'two'] })
})

test('tags -- handles windows and old mac line endings', () => {
  const { signature } = defineAll()

  assert.deepEqual(tagged(signature, 'a\r\nb\rc\nd'), { signature: ['a', 'b', 'c', 'd'] })
})
