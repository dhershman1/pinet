const path = require('path')
const { capitalize, concat, map } = require('kyanite')
const { a, aside, compile, div, footer, h1, header, li, link, main, meta, span, text, ul } = require('../engine')

function buildMeta (metaArr) {
  if (!metaArr) {
    return []
  }

  return metaArr.map(meta)
}

function buildNav (nav) {
  return ul({ class: 'nav' }, map(({ name, cat }) => {
    return li({ class: 'nav__item', 'data-cat': cat }, [
      a({ class: 'nav__link', href: `#${name}` }, [
        text(name),
        span({ class: 'nav__type tag' }, [text(cat)])
      ])
    ])
  }, nav))
}

function buildHeader (links) {
  return ul({ class: 'header-nav' }, map(({ name, link }) => {
    return li({ class: 'header-nav__item' }, [
      a({ class: 'header-nav__link', href: link }, [
        text(name)
      ])
    ])
  }, concat({ name: 'Documentation', link: '/index.html' }, links)))
}

function validatePkg (pth) {
  return path.parse(pth).base === 'package.json'
}

function layout (opts, children = [], nav = []) {
  const pkg = opts.packageJson && validatePkg(opts.packageJson) ? require(opts.packageJson) : false

  return concat(compile('html', { lang: opts.lang || 'en' }, [
    compile('head', {}, [
      ...buildMeta(opts.meta),
      compile('title', {}, opts.title || 'Documentation'),
      link({ href: 'static/css/main.css', rel: 'stylesheet' }),
      // link({ href: 'static/css/prettify.css', rel: 'stylesheet' }),
      link({ href: 'static/css/hl.css', rel: 'stylesheet' })
    ]),
    compile('body', { id: 'root' }, div({ class: 'grid' }, [
      header({}, [
        div({ class: 'header-nav__title' }, [
          compile('strong', {}, text(capitalize(pkg.name))),
          span({ class: 'header-nav__version' }, [text(` v${pkg.version}`)])
        ]),
        ...buildHeader(opts.links)
      ]),
      aside({}, [compile('input', {
        class: 'filter',
        type: 'text',
        id: 'filter',
        placeholder: 'Search'
      }, []), ...buildNav(nav)]),
      main({}, children),
      footer({}, [text('Powered by Pinet')]),
      compile('script', { src: 'static/js/search.js' }, [])
    ]))
  ]), '<!DOCTYPE html>')
}

module.exports = layout
