const { concat } = require('kyanite')
const { compile, link, main, meta } = require('../engine')

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
      link({ href: 'static/css/prettify.css', rel: 'stylesheet' }),
      link({ href: 'static/css/hl.css', rel: 'stylesheet' })
    ]),
    compile('body', { id: 'root' }, main({ class: 'container' }, children))
  ]), '<!DOCTYPE html>')
}

module.exports = layout
