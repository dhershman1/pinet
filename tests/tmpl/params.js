const test = require('tape')
const params = require('../../tmpl/params')

const plain = [{ name: 'tmp', description: 'Testing 123' }]
const defaults = [{ name: 'tmp', description: 'Testing 123', defaultvalue: 1 }]

test('params -- Generates Tables', t => {
  t.same(params(plain), '<table class="params__table"><thead class="params__thead"><tr class="params__tr"><th class="params__th params__th--name">Name</th><th class="params__th params__th--type">Type</th><th class="params__th params__th--description">Description</th></tr></thead><tbody class="params__tbody"><tr class="params__tr"><td class="params__td params__td--name"><code>tmp</code></td><td class="params__td params__td--description">Testing 123</td></tr></tbody></table>')
  t.same(params(defaults), '<table class="params__table"><thead class="params__thead"><tr class="params__tr"><th class="params__th params__th--name">Name</th><th class="params__th params__th--type">Type</th><th class="params__th params__th--default">Default</th><th class="params__th params__th--description">Description</th></tr></thead><tbody class="params__tbody"><tr class="params__tr"><td class="params__td params__td--name"><code>tmp</code></td><td class="params__td params__td--defaultvalue">1</td><td class="params__td params__td--description">Testing 123</td></tr></tbody></table>')
  t.end()
})
