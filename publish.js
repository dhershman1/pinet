const engine = require('./engine')
const layout = require('./tmpl/layout')
const container = require('./tmpl/container')
const helper = require('jsdoc/util/templateHelper')
const path = require('path')
const fs = require('fs-extra')

/* global env */

function publish (taffyData, opts) {
  console.time('publish')
  const data = helper.prune(taffyData)
  const pinet = Object.assign({}, { classes: {} }, env.conf.pinet, { hasHome: Boolean(opts.readme) })
  const children = []
  const navList = []
  const render = layout(pinet)
  let pkg = null

  fs.mkdirp(opts.destination)
    .then(() => {
      data().each(doclet => {
        if (doclet.kind !== 'package') {
          navList.push({ name: doclet.name, cat: doclet.category })
          children.push(container(pinet, doclet))
        } else {
          pkg = doclet
        }
      })

      return fs.writeFile(path.join(opts.destination, 'documentation.html'), render(children, navList, pkg))
    })
    .then(() =>
      fs.writeFile(path.join(opts.destination, 'index.html'), render([], navList, pkg, opts.readme)))
    .then(() =>
      fs.copy('static', path.join(opts.destination, 'static')))
    .then(() => {
      console.log('Write Finished')
      console.timeEnd('publish')
    })
    .catch(console.error)
}

module.exports = {
  engine,
  publish
}
