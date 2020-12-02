const path = require('path')

const { concat } = require('kyanite')

const navbar = require('./navbar')
const { a, compile, div, footer, input, label, link, main, meta, text } = require('../engine')

/**
 * @private
 * @param {Array} metaArr An array of Objects that will build out meta links in our layout
 */
function buildMeta (metaArr) {
  if (!metaArr) {
    return []
  }

  return metaArr.map(meta)
}

function determineExtraCSS (sheet = '') {
  // Check to see if the string contains a hyperlink starter
  if (sheet.includes('http://') || sheet.includes('https://')) {
    return sheet
  }

  const { base } = path.parse(sheet)

  return path.join('static', 'css', base)
}

/**
 * Handles keeping everyone organized to build out the actual documentation html pages using the other modules
 * @param {Object} opts The options passed from jsdocs config
 */
function layout (opts) {
  const headLinks = [
    ...buildMeta(opts.meta),
    compile('title', {}, opts.title || 'Documentation'),
    link({ href: 'static/css/main.css', rel: 'stylesheet' }),
    link({ href: 'static/css/hl.css', rel: 'stylesheet' })
  ]

  if (opts.cssSheet) {
    headLinks.push(link({ href: determineExtraCSS(opts.cssSheet), rel: 'stylesheet' }))
  }

  return function (children = [], nav = [], navExtras = {}, html = '') {
    return concat(compile('html', { lang: opts.lang || 'en' }, [
      compile('head', {}, headLinks),
      compile('body', { id: 'root' }, div({ class: 'grid' }, [
        input({ type: 'checkbox', id: 'nav-trigger', class: 'nav-trigger' }),
        label({ for: 'nav-trigger', class: 'navicon-button x' }, [
          div({ class: 'navicon' }, [])
        ]),
        label({ for: 'nav-trigger', class: 'overlay' }, []),
        navbar(nav, opts, navExtras),
        html ? main({}, div({ class: 'wrapper' }, html)) : main({}, children),
        footer({}, [
          text('Powered by '),
          a({ href: 'https://github.com/dhershman1/pinet' }, [text('Pinet')])
        ]),
        compile('script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js' }, []),
        compile('script', { src: 'static/js/search.js' }, [])
      ]))
    ]), '<!DOCTYPE html>')
  }
}

module.exports = layout
