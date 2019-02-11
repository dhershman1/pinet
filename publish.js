const engine = require('./engine')
const layout = require('./tmpl/layout')
const container = require('./tmpl/container')
const helper = require('jsdoc/util/templateHelper')
const template = require('jsdoc/template')
const path = require('path')

function publish (taffyData, opts, c) {
  const loc = path.normalize(opts.template)
  const data = helper.prune(taffyData)
  const pinet = Object.assign({}, { classes: {} }, env.conf.pinet)
  let view = new template.Template(path.join(loc, 'tmpl'))

  view.layout = 'layout.js'
  const children = []

  data().each(doclet => {
    if (doclet.kind !== 'package') {
      children.push(container(opts, doclet))
    }
  })

  console.log(layout(pinet, children))
}

module.exports = {
  engine,
  publish
}
