const path = require('path')
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

function validatePkg (pth) {
  return path.parse(pth).base === 'package.json'
}

function buildPageNav (packageJson, links) {
  const pkg = packageJson && validatePkg(packageJson) ? require(packageJson) : false

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
      concat(links, [{ name: 'Home', link: 'index.html' }, { name: 'Documentation', link: 'documentation.html' }])))
  ])
}

function navbar (nav, { links, packageJson }) {
  return aside({}, [
    buildPageNav(packageJson, links),
    compile('input', {
      class: 'filter',
      type: 'text',
      id: 'filter',
      placeholder: 'Search'
    }, []), ...buildFunctionNav(nav)])
}

module.exports = navbar