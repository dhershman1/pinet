const { concat } = require('kyanite')
const navbar = require('./navbar')
const { compile, div, footer, input, label, link, main, meta, text } = require('../engine')

function buildMeta (metaArr) {
  if (!metaArr) {
    return []
  }

  return metaArr.map(meta)
}

function layout (opts) {
  return function (children = [], nav = [], html) {
    return concat(compile('html', { lang: opts.lang || 'en' }, [
      compile('head', {}, [
        ...buildMeta(opts.meta),
        compile('title', {}, opts.title || 'Documentation'),
        link({ href: 'static/css/main.css', rel: 'stylesheet' }),
        // link({ href: 'static/css/prettify.css', rel: 'stylesheet' }),
        link({ href: 'static/css/hl.css', rel: 'stylesheet' })
      ]),
      compile('body', { id: 'root' }, div({ class: 'grid' }, [
        input({ type: 'checkbox', id: 'nav-trigger', class: 'nav-trigger' }),
        label({ for: 'nav-trigger', class: 'navicon-button x' }, [
          div({ class: 'navicon' }, [])
        ]),
        label({ for: 'nav-trigger', class: 'overlay' }, []),
        navbar(nav, opts),
        main({}, html || children),
        footer({}, [text('Powered by Pinet')]),
        compile('script', { src: 'static/js/search.js' }, [])
      ]))
    ]), '<!DOCTYPE html>')
  }
}

module.exports = layout
