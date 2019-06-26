const { concat, map } = require('kyanite')
const { a, aside, compile, div, footer, li, link, main, meta, p, span, text, ul } = require('../engine')

function buildMeta (metaArr) {
  if (!metaArr) {
    return []
  }

  return metaArr.map(meta)
}

function buildNav (nav) {
  return ul({ class: 'nav' }, map(({ name, cat }) => {
    return li({ class: 'nav__item' }, [
      a({ class: 'nav__link', href: `#${name}` }, [
        text(name),
        span({ class: 'nav__type tag' }, [text(cat)])
      ])
    ])
  }, nav))
}

function layout (opts, children = [], nav = []) {
  return concat(compile('html', { lang: opts.lang || 'en' }, [
    compile('head', {}, [
      ...buildMeta(opts.meta),
      compile('title', {}, opts.title || 'Documentation'),
      link({ href: 'static/css/main.css', rel: 'stylesheet' }),
      // link({ href: 'static/css/prettify.css', rel: 'stylesheet' }),
      link({ href: 'static/css/hl.css', rel: 'stylesheet' })
    ]),
    compile('body', { id: 'root' }, div({ class: 'grid' }, [
      aside({}, buildNav(nav)),
      main({}, children),
      footer({}, [text('Copyright Dustin Hershman 2019')])
    ]))
  ]), '<!DOCTYPE html>')
}

module.exports = layout
