<p align=center>
  <a href="./LICENSE">
    <img
      alt="license:mit"
      src="https://img.shields.io/badge/license-mit-green.svg?style=flat-square&color=%23bef9c6"
    />
  </a>
  <a href="https://www.npmjs.com/package/pinet">
    <img alt="Npm Version" src="https://img.shields.io/npm/v/pinet.svg?style=flat-square&color=%23bef9c6">
  </a>
  <a href="https://github.com/dhershman1/pinet/actions/workflows/pinet.yml">
    <img alt="Build Status" src="https://img.shields.io/github/actions/workflow/status/dhershman1/pinet/pinet.yml?style=flat-square&logo=github">
  </a>
</p>

# Pinet

Yet another documentation template for [jsdoc](https://jsdoc.app/), built on a small functional html engine you can use too

![pinet](https://user-images.githubusercontent.com/8997380/63355490-336ce100-c334-11e9-88ce-b6a4643ed18a.png)

- Clean single page documentation with a searchable nav, filterable by name or category
- Optional source code pages for every function
- Your README as the home page and your changelog as its own page
- Code highlighting done while your docs build, no scripts loaded from a CDN
- Extra tags for functional libraries like `@category` and `@sig`

## See It In Action

- [Kyanite](https://kyanite.dusty.codes/)
- [Phone-Fns](https://phone-fns.dusty.codes/)

## Install

Pinet requires Node.js 22.12 or newer and jsdoc 4

```sh
npm i -D jsdoc pinet
```

## Usage

Create a `jsdoc.json` config that uses Pinet as its template:

```json
{
  "source": {
    "include": ["src/", "package.json", "README.md"]
  },
  "plugins": [
    "plugins/markdown",
    "node_modules/pinet/tags.js"
  ],
  "opts": {
    "template": "node_modules/pinet",
    "destination": "./docs/",
    "recurse": true
  },
  "pinet": {
    "title": "My Library -- Documentation",
    "changelog": "./CHANGELOG.md"
  }
}
```

Then point the jsdoc cli at it, usually as a script in your `package.json`:

```json
"scripts": {
  "docs": "jsdoc -c jsdoc.json"
}
```

Including your `package.json` and `README.md` in `source.include` is highly recommended. Pinet uses the package name and version in the nav, and the README becomes your home page. Without a `package.json` the nav shows `Unknown v0.0.0`.

The `plugins/markdown` plugin is optional, with it your descriptions can use markdown. Lists, code blocks, and so on all render properly, and code blocks are highlighted.

If the build fails jsdoc exits with a failure code, so a broken docs build will fail your scripts and CI.

## Options

All of these go in the `pinet` section of your jsdoc config, and all of them are optional

| Option | Type | Description |
| --- | --- | --- |
| `title` | `String` | The title of your documentation pages, defaults to `Documentation` |
| `genSources` | `Boolean` | Generate a source code page for each function and link to it |
| `changelog` | `String` | Path to a markdown changelog, it gets its own page and a link in the nav |
| `links` | `Array` | Extra links for the nav, each one is an object with a `name` and a `link` |
| `lang` | `String` | The `lang` attribute of the `html` tag, defaults to `en` |
| `customTags` | `Array` | Names of custom tags to show in each functions details list, see [Custom Tags](#custom-tags) |
| `meta` | `Array` | Meta tags to add to each page, each object is turned into a `meta` element with its properties as attributes |

Pinet also follows jsdoc's own `verbose` option (`opts.verbose`), which logs each step of the build. Handy for finding where a build goes wrong.

A full example:

```json
{
  "pinet": {
    "title": "Kyanite -- Documentation",
    "genSources": true,
    "changelog": "./CHANGELOG.md",
    "lang": "en",
    "links": [
      {
        "name": "Github",
        "link": "https://github.com/dhershman1/kyanite"
      }
    ],
    "customTags": [
      "category",
      "signature"
    ],
    "meta": [
      {
        "charset": "UTF-8"
      },
      {
        "name": "viewport",
        "content": "width=device-width, initial-scale=1.0"
      }
    ]
  }
}
```

## Custom Tags

Pinet comes with a few extra tags. Add its `tags.js` to your jsdoc plugins to use them:

```json
"plugins": [
  "node_modules/pinet/tags.js"
]
```

| Tag | Description |
| --- | --- |
| `@category` | A category for the function, shown as a tag in the details and the nav, and searchable |
| `@signature` or `@sig` | A type signature like `a -> b -> c`, each line becomes its own entry |
| `@recipe` | A short recipe or usage note, each line becomes its own entry |

```js
/**
 * Adds two numbers together
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The first number
 * @param {Number} b The second number
 * @return {Number} The sum of both numbers
 */
```

To show a tag in each functions details list, add its name to the `customTags` option (use `signature` for both `@signature` and `@sig`). The nav always uses `@category`.

Any other tag jsdoc puts on a doclet can go in `customTags` too, its value is shown as plain text.

Feel free to open an issue to request other custom tags you may want to see!

## Templating Engine

The engine behind Pinet can be used on its own to build html with plain functions. Every element builder is curried and takes an attributes object and a list of children.

```js
const { compile, div, p, escape, text } = require('pinet')
// or
import { compile, div, p, escape, text } from 'pinet'

compile('span', { data: 'testing' }, [
  p({}, [text('Hello!')])
]) // => '<span data="testing"><p>Hello!</p></span>'

// Builders are curried, so you can make your own
const card = div({ class: 'card' })

card([p({}, [escape('Tom & Jerry')])]) // => '<div class="card"><p>Tom &amp; Jerry</p></div>'
```

- `compile(tag, attributes, children)` builds any element
- Builders for common elements: `a`, `aside`, `code`, `dd`, `div`, `dl`, `dt`, `footer`, `h1` - `h6`, `header`, `label`, `li`, `main`, `p`, `pre`, `section`, `span`, `table`, `tbody`, `td`, `th`, `thead`, `tr`, `ul`
- Self closing builders that only take attributes: `img`, `input`, `link`, `meta`
- `escape(value)` turns a value into safe html text, use it for anything that is plain text
- `text(html)` passes html through as is, use it for html you trust
- Attribute values are always escaped

## Upgrading From v1

v2 is a major release, see the [changelog](./CHANGELOG.md) for everything that changed. The things most likely to affect you:

- Node.js 22.12 or newer is required, and `jsdoc` needs to be installed alongside Pinet
- Plain text values are escaped, so raw html in things like param names or `@since` values shows up as text. Descriptions are still html
- Some parameter table class names changed, if you style them yourself check the changelog
- Highlight.js is no longer loaded in the browser, all highlighting happens at build time
