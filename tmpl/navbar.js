const { capitalize, concat, map } = require('kyanite')
const { a, aside, compile, div, escape, span, ul, p, li } = require('../engine')

/**
 * Builds out the navigation menu forthe functions
 * @param {Array} nav An array of nav objects and strings
 */
function buildFunctionNav (nav) {
  return ul({ class: 'nav' }, map(({ name, cat }) => {
    return li({ class: 'nav__item', 'data-cat': cat ?? '', 'data-name': name }, [
      a({ class: 'nav__link', href: `documentation.html#${encodeURIComponent(name)}` }, [
        span({ class: 'nav__name' }, [escape(name)]),
        ...(cat ? [span({ class: 'nav__type tag' }, [escape(cat)])] : [])
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
  // jsdoc always creates a package doclet, but it has no name or version without a package.json in the sources
  const { name = 'Unknown', version = '0.0.0' } = packageJson || {}
  const defaultLinks = [
    { name: 'Home', link: 'index.html' },
    { name: 'Documentation', link: 'documentation.html' },
    ...(changelog ? [{ name: 'Changelog', link: 'changelog.html' }] : [])
  ]

  return div({ class: 'pagenav' }, [
    p({ class: 'pagenav__title' }, [
      compile('strong', {}, [escape(capitalize(name))]),
      span({ class: 'pagenav__version' }, [escape(` v${version}`)])
    ]),
    p({ class: 'pagenav__links' }, map(({ name, link }) =>
      a({
        class: 'pagenav__link',
        href: link
      },
      [escape(name)]),
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
