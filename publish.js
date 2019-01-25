const engine = require('./engine')
const layout = require('./tmpl/layout')
const helper = require('jsdoc/util/templateHelper')
const template = require('jsdoc/template')
const path = require('path')

function publish (taffyData, opts, c) {
  const loc = path.normalize(opts.template)
  const data = helper.prune(taffyData)
  const pinet = Object.assign({}, { classes: {} }, env.conf.pinet)
  let view = new template.Template(path.join(loc, 'tmpl'))

  view.layout = 'layout.js'

  data().each(doclet => {
    if (doclet.params) {
      console.log(doclet.params[0])
    }
  })
}

module.exports = {
  engine,
  publish
}
