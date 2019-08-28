const { capitalize, concat, map } = require('kyanite')
const { a, aside, compile, div, span, text, ul, p, li } = require('../engine')

function buildFunctionNav (nav) {
  return ul({ class: 'nav' }, map(({ name, cat }) => {
    return li({ class: 'nav__item', 'data-cat': cat }, [
      a({ class: 'nav__link', href: `documentation.html#${name}` }, [
        span({ class: 'nav__name' }, [text(name)]),
        span({ class: 'nav__type tag' }, [text(cat)])
      ])
    ])
  }, nav))
}

function buildPageNav (packageJson, changelog, links = []) {
  const pkg = packageJson || { name: 'Unknown', version: '0.0.0' }
  const defaultLinks = [
    { name: 'Home', link: 'index.html' },
    { name: 'Documentation', link: 'documentation.html' }
  ]

  if (changelog) {
    defaultLinks.push({ name: 'Changelog', link: 'changelog.html' })
  }

  return div({ class: 'pagenav' }, [
    p({ class: 'pagenav__title' }, [
      compile('strong', {}, text(capitalize(pkg.name))),
      span({ class: 'pagenav__version' }, [text(` v${pkg.version}`)])
    ]),
    p({ class: 'pagenav__links' }, map(({ name, link }) =>
      a({
        class: 'pagenav__link',
        href: link
      },
      [text(name)]),
    concat(links, defaultLinks)))
  ])
}

function navbar (nav, { links }, { pkg, changelog }) {
  return aside({ class: 'side-nav' }, [
    buildPageNav(pkg, changelog, links),
    compile('input', {
      class: 'filter',
      type: 'text',
      id: 'filter',
      placeholder: 'Search Category or Function name'
    }, []), ...buildFunctionNav(nav)])
}

module.exports = navbar
