const engine = require('./engine')
const layout = require('./tmpl/layout')
const container = require('./tmpl/container')
const helper = require('jsdoc/util/templateHelper')
const path = require('path')
const fs = require('fs-extra')

function publish (taffyData, opts, c) {
  console.time('publish')
  const data = helper.prune(taffyData)
  const pinet = Object.assign({}, { classes: {} }, env.conf.pinet, { hasHome: Boolean(opts.readme) })
  const render = layout(pinet)
  const children = []
  const navList = []


  fs.mkdirp(opts.destination)
    .then(() => {
      data().each(doclet => {
        if (doclet.kind !== 'package') {
          navList.push({ name: doclet.name, cat: doclet.category })
          children.push(container(pinet, doclet))
        }
      })

      return fs.writeFile(path.join(opts.destination, 'documentation.html'), render(children, navList))
    })
    .then(() =>
      fs.writeFile(path.join(opts.destination, 'index.html'), render([], navList, opts.readme)))
    .then(() =>
      fs.copy('static', path.join(opts.destination, 'static')))
    .then(() => {
      console.log('Write Finished')
      console.timeEnd('publish')
    })
}

module.exports = {
  engine,
  publish
}
