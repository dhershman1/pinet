# Pinet

Yet another documentation template for jsdocs

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

![pinet](https://user-images.githubusercontent.com/8997380/63355490-336ce100-c334-11e9-88ce-b6a4643ed18a.png)

## Install

```cli
npm i -D pinet
```

## Custom Tags

Pinet comes with some custom tag support you can use, within your jsdoc config simply tell it to use pinets tags.js like so:

```json
"plugins": [
    "node_modules/pinet/tags.js"
  ],
```

Currently `category` and `sig/signatue` tags are supported here. Feel free to open an issue to request other custom tags you may want to see!

## Changelogs

You can also choose to have your changelog listed within the links of your documentation, simply provide the path to the changelog

```json
"changelog": "./CHANGELOG.md",
```

Pinet will then go find, and parse the markdown into html to display on your site

## See It In Action

You can check out kyanites documentation which is using the pinet templating engine to build its docs.

Check it out here: https://kyanite.dusty.codes/

## Options

- `title` - `String`: This is the title of the pages for your docs
- `genSources` - `Boolean`: Set this to `true` if you want sources files to be generated and linked in your documentation
- `links` - `Array`: An array of objects to add to the nav, each object needs a `name` and `link` property
- `lang` - `String`: The value to set the `lang` attribute to on the `html` tag
- `customTags` - `Array`: An array of strings which should be the tag names you want pinet to consider
- `meta` - `Array`: An array of meta objects each object is built out into a meta element the properties provided will be turned into attributes

Example:

```json
{
  "pinet": {
    "title": "Testing -- Documentation",
    "links": [
      {
        "name": "Github",
        "link": "https://github.com/dhershman1/kyanite"
      }
    ],
    "genSources": true,
    "lang": "en",
    "changelog": "./CHANGELOG.md",
    "customTags": [
      "category",
      "signature"
    ],
    "meta": [
      {
        "name": "viewport",
        "content": "width=device-width, initial-scale=1.0"
      },
      {
        "charset": "UTF-8"
      }
    ]
  }
}
```

## Usage

Setup a jsdoc.json file with your options and settings. It is Highly recommended you provide not only the source folders for your js files but **also** a path to the `readme` and `package.json` so that small bits of information can be properly stored

Than use the jsdoc cli and point it to your config json:
```cli
node_modules/.bin/jsdoc -c jsdoc.json
```

This will generate a new set of files to give you html rendered documentation

## Templating Engine

The actual engine behind Pinet, is importable for your own use as well. You can bring it in and use it to generate all kinds of html and functionality.

```js
import { compile, p, text } from 'pinet'

compile('span', { data: 'testing' }, [
  p({}, [text('Hello!')])
]) // => <span data="testing"><p>Hello!</p></span>
```
