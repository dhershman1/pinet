const test = require('tape')
const params = require('../../tmpl/params')

const plain = { params: [{ name: 'tmp', description: 'Testing 123' }] }
const defaults = { params: [{ name: 'tmp', description: 'Testing 123', defaultvalue: 1 }] }

test('params -- Generates Tables', t => {
  t.same(params(plain), '<table class="params"><thead class="params__thead"><tr class="params__tr"><th class="params__th--name">Name</th><th class="params__th--type">Type</th><th class="params__th--description">Description</th></tr></thead><tbody class="params__tbody"><tr class="params__tr"><td class="params__td--name">tmp</td><td class="params__td--description">Testing 123</td></tr></tbody></table>')
  t.same(params(defaults), '<table class="params"><thead class="params__thead"><tr class="params__tr"><th class="params__th--name">Name</th><th class="params__th--type">Type</th><th class="params__th--default">Default</th><th class="params__th--description">Description</th></tr></thead><tbody class="params__tbody"><tr class="params__tr"><td class="params__td--name">tmp</td><td class="params__td--defaultvalue">1</td><td class="params__td--description">Testing 123</td></tr></tbody></table>')
  t.end()
})
