const engine = require('./engine')
const layout = require('./tmpl/layout')
const container = require('./tmpl/container')
const helper = require('jsdoc/util/templateHelper')
const path = require('path')
const fs = require('fs-extra')
const marked = require('marked')

/* global env */

function publish (taffyData, opts) {
  console.time('write docs')
  const dest = file => path.join(opts.destination, file)
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

      return fs.writeFile(dest('documentation.html'), render(children, navList, {
        pkg,
        changelog: pinet.changelog
      }))
    })
    .then(() =>
      fs.writeFile(dest('index.html'), render([], navList, {
        pkg,
        changelog: pinet.changelog
      }, opts.readme)))
    .then(() =>
      fs.copy(path.join(__dirname, 'static'), dest('static')))
    .then(() => {
      if (pinet.changelog) {
        return fs.readFile(pinet.changelog, 'UTF-8')
      }

      return false
    })
    .then(data => {
      if (data) {
        return fs.writeFile(dest('changelog.html'), render([], navList, {
          pkg,
          changelog: pinet.changelog
        }, marked(data)))
      }

      return false
    })
    .catch(err => {
      if (err.errno === -2) {
        console.error('Changelog.md could not be found. Continuing without...')
      } else {
        console.error(err)
      }
    })
    .finally(() => {
      console.log('Write Finished')
      console.timeEnd('write docs')
    })
}

module.exports = {
  engine,
  publish
}
