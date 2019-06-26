const { concat } = require('kyanite')
const { aside, div, compile, link, main, meta, text, footer } = require('../engine')

function buildMeta (metaArr) {
  if (!metaArr) {
    return []
  }

  return metaArr.map(meta)
}

function layout (opts, children = []) {
  return concat(compile('html', { lang: opts.lang || 'en' }, [
    compile('head', {}, [
      ...buildMeta(opts.meta),
      compile('title', {}, opts.title || 'Documentation'),
      link({ href: 'static/css/main.css', rel: 'stylesheet' }),
      // link({ href: 'static/css/prettify.css', rel: 'stylesheet' }),
      link({ href: 'static/css/hl.css', rel: 'stylesheet' })
    ]),
    compile('body', { id: 'root' }, div({ class: 'grid' }, [
      aside({}, [text('420 swag')]),
      main({}, children),
      footer({}, [text('Copyright Dustin Hershman 2019')])
    ]))
  ]), '<!DOCTYPE html>')
}

module.exports = layout
