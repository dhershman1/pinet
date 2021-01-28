const { capitalize, concat, map } = require('kyanite')
const { a, aside, compile, div, span, text, ul, p, li } = require('../engine')

/**
 * Builds out the navigation menu forthe functions
 * @param {Array} nav An array of nav objects and strings
 */
function buildFunctionNav (nav) {
  return ul({ class: 'nav' }, map(({ name, cat }) => {
    return li({ class: 'nav__item', 'data-cat': cat, name }, [
      a({ class: 'nav__link', href: `documentation.html#${name}` }, [
        span({ class: 'nav__name' }, [text(name)]),
        span({ class: 'nav__type tag' }, [text(cat)])
      ])
    ])
  }, nav))
}

/**
 * Handles building out our navigation above our function nav, this is for navigating to different pages and the github
 * @param {Object} packageJson The package json options
 * @param {Boolean} changelog A changelog boolean to determine if we need to render a log
 * @param {Array} links A list of links to render on the page
 */
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

/**
 *
 * @param {Array} nav A nav array for all the functions we need to render
 * @param {Object} param1 The options object from jsdoc
 * @param {Array} param1.links The array of links we need to render
 * @param {Object} param2 Extras object for the package.json and changelog information
 * @param {Object} param2.pkg The package json
 * @param {Object} param2.changelog The changelog markdown information
 */
function navbar (nav, { links }, { pkg, changelog }) {
  return aside({ class: 'side-nav' }, [
    buildPageNav(pkg, changelog, links),
    compile('input', {
      class: 'filter',
      type: 'text',
      id: 'pinetFilter',
      placeholder: 'Search Category or Function name'
    }, []), ...buildFunctionNav(nav)])
}

module.exports = navbar
