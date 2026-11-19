const { test } = require('node:test')
const assert = require('node:assert/strict')
const _curry2 = require('../_internals/_curry2')
const _curry3 = require('../_internals/_curry3')
const _log = require('../_internals/_log')
const _sourceFile = require('../_internals/_sourceFile')

test('_curry2 -- supports every call style', () => {
  const add = _curry2((a, b) => a + b)

  assert.equal(add(), add)
  assert.equal(add(1, 2), 3)
  assert.equal(add(1)(2), 3)
})

test('_curry3 -- supports every call style', () => {
  const add = _curry3((a, b, c) => a + b + c)

  assert.equal(add(), add)
  assert.equal(add(1, 2, 3), 6)
  assert.equal(add(1)(2)(3), 6)
  assert.equal(add(1)(2, 3), 6)
  assert.equal(add(1, 2)(3), 6)
})

test('_log -- only logs when verbose', t => {
  const spy = t.mock.method(console, 'log', () => {})

  _log(false)('quiet')
  assert.equal(spy.mock.callCount(), 0)

  _log(true)('loud', 1)
  assert.equal(spy.mock.callCount(), 1)
  assert.deepEqual(spy.mock.calls[0].arguments, ['loud', 1])
})

test('_sourceFile -- turns doclet names into safe file names', () => {
  assert.equal(_sourceFile('add'), 'add.html')
  assert.equal(_sourceFile('add_index-2.v1'), 'add_index-2.v1.html')
  assert.equal(_sourceFile('utils/math'), 'utils_math.html')
  assert.equal(_sourceFile('module:utils/math~double'), 'module_utils_math_double.html')
  assert.equal(_sourceFile('Foo#bar'), 'Foo_bar.html')
  assert.equal(_sourceFile('../evil'), '.._evil.html')
})
