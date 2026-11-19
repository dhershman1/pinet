const path = require('path')
const fs = require('fs-extra')

const marked = require('marked')
const helper = require('jsdoc/util/templateHelper')
const logger = require('jsdoc/util/logger')

const engine = require('./engine')
const layout = require('./tmpl/layout')
const container = require('./tmpl/container')
const source = require('./tmpl/source')
const log = require('./_internals/_log')

/* global env */

/**
 *
 * @param {Object} taffyData Template Data provided by jsdocs
 * @param {Object} opts Options Object provided by jsdocs
 * @returns {Promise} Resolves once every file is written, jsdoc waits on this before exiting
 */
function publish (taffyData, opts) {
  console.time('Time')
  // A simple destination function
  const dest = file => path.join(opts.destination, file)
  const _log = log(opts.verbose)
  // Prune Template data using jsdoc helper
  const data = helper.prune(taffyData)
  // Build up pinet options
  const pinet = { classes: {}, ...env.conf.pinet, verbose: opts.verbose, hasHome: Boolean(opts.readme) }
  const children = []
  const navList = []
  const sources = []
  // Ready the layout renderer
  const render = layout(pinet)
  let pkg = null

  _log('Starting Write...')
  _log('Destination:', opts.destination)
  // Generate the destination folder
  return fs.mkdirp(opts.destination)
    // Loop through documentation data
    .then(() => {
      data().each(doclet => {
        // If not package.json then build out the child element and add it to the nav list
        if (doclet.kind !== 'package') {
          _log('Processing:', doclet.name)
          navList.push({ name: doclet.name, cat: doclet.category })
          children.push(container(pinet, doclet))
          // If we are generating source files make sure we do that too
          if (pinet.genSources) {
            _log('Generating Source:', doclet.name)
            sources.push(source(doclet))
          }
        // Otherwise its the package json data so set that
        } else {
          _log('Found Package JSON...')
          pkg = doclet
        }
      })

      // Start writing the rendered out documentation html into an html file
      _log('Writing Main Documentation HTML...')
      return fs.writeFile(dest('documentation.html'), render(children, navList, {
        pkg,
        changelog: pinet.changelog
      }))
    })
    // Run each source code function we generated and added to our array
    // This is an array of promises generated above to build source html
    .then(() => {
      _log('Running Source Code Generation...')

      return Promise.all(sources)
    })
    // Once we run through all of our promises then go ahead and start writing them all out
    // Onto rendered HTML files, skipping any source files that could not be read
    .then(sourceHtml => {
      _log('Writing Source Code HTML Files...')
      return Promise.all(sourceHtml.filter(Boolean).map(({ name, html }) =>
        fs.writeFile(path.join(opts.destination, `${name}.html`), render(html, navList, {
          pkg,
          changelog: pinet.changelog
        }))))
    })
    // Create the primary index html for the main home page and write it
    .then(() => {
      _log('Writing Index HTML...')
      return fs.writeFile(dest('index.html'), render([], navList, {
        pkg,
        changelog: pinet.changelog
      }, opts.readme))
    })
    // Copy over all the static files into our docs/static folder
    .then(() => {
      _log('Copying Static Files...')
      return fs.copy(path.join(__dirname, 'static'), dest('static'))
    })
    // If the user provided a changelog location then go ahead and read the data
    // If the file can't be found let the user know and continue without it
    .then(() => {
      if (pinet.changelog) {
        _log('Reading Changelog...')
        return fs.readFile(pinet.changelog, 'UTF-8')
          .catch(err => {
            if (err.code === 'ENOENT') {
              console.error(`Changelog could not be found at ${pinet.changelog}. Continuing without...`)
              return false
            }

            throw err
          })
      }

      _log('No Changelog Found Skipping...')
      return false
    })
    // Take the changelog data and format it into html using the marked package
    // Then take that and write the changelog html file
    .then(data => {
      if (data) {
        _log('Writing Changelog HTML...')
        return fs.writeFile(dest('changelog.html'), render([], navList, {
          pkg,
          changelog: pinet.changelog
        }, marked.parse(data)))
      }

      return false
    })
    // If something went wrong log it through jsdoc's logger, this tells jsdoc to exit with a failure code
    .catch(err => {
      logger.error('Pinet failed to write the documentation: %s', err.stack || err)
    })
    // Once finished Log out that we're done, and print out the time it took
    .finally(() => {
      console.log('Write Finished')
      console.timeEnd('Time')
    })
}

module.exports = {
  engine,
  publish
}
