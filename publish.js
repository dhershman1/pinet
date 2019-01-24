const engine = require('./engine')
const layout = require('./tmpl/layout')
const helper = require('jsdoc/util/templateHelper')
const template = require('jsdoc/template')
const path = require('path')

function publish (taffyData, opts, c) {
  const loc = path.normalize(opts.template)
  const data = helper.prune(taffyData)
  const pinet = env.conf.pinet
  let view = new template.Template(path.join(loc, 'tmpl'))
  console.log('opts', opts)
  console.log('c', c)
  console.log('env', env.conf.templates)

  view.layout = 'layout.js'

  data().each(doclet => {
    console.log(doclet)
  })
}

module.exports = {
  engine,
  publish
}
