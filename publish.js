const engine = require('./engine')
const layout = require('./tmpl/layout')
const container = require('./tmpl/container')
const helper = require('jsdoc/util/templateHelper')
const template = require('jsdoc/template')
const path = require('path')
const fs = require('fs')

function publish (taffyData, opts, c) {
  const loc = path.normalize(opts.template)
  const data = helper.prune(taffyData)
  const pinet = Object.assign({}, { classes: {} }, env.conf.pinet)
  let view = new template.Template(path.join(loc, 'tmpl'))

  view.layout = 'layout.js'
  const children = []
  const navList = []


  data().each(doclet => {
    if (doclet.kind !== 'package') {
      navList.push({ name: doclet.name, cat: doclet.category })
      children.push(container(pinet, doclet))
    }
  })

  // console.log(layout(pinet, children))

  fs.writeFile('index.html', layout(pinet, children, navList), err => {
    if (err) {
      console.error(err)
      throw err
    }

    console.log('Write Finished')
  })
}

module.exports = {
  engine,
  publish
}
