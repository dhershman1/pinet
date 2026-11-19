# Changelog

## v2.0.0

### Breaking Changes

- Pinet now requires Node.js 22.12 or newer (`marked` v18 is ESM only, and 22.12 is the first 22.x that can `require()` it without a flag)
- `jsdoc` is now a peer dependency (`^4.0.0`) instead of something Pinet quietly expected to be installed
  - Install it alongside Pinet: `npm i -D jsdoc pinet`
- The published package now only contains the files Pinet needs at runtime
  - Tests, configs, and other development files are no longer shipped
- Plain text values are now HTML escaped when rendered
  - This covers names, types, default values, page titles, the nav, and the details list (`since`, `see`, `category`, custom tags, etc.)
  - Descriptions are still rendered as HTML, so markdown and inline HTML in them keep working
  - The engine now escapes every attribute value, so `div({ title: 'a "b"' }, [])` renders `title="a &quot;b&quot;"`
- Parameter table markup changed so every row lines up with its headers
  - Every cell is always rendered (empty when a parameter has no value for that column)
  - Every cell has the `params__td` class plus a `params__td--<column>` modifier
  - The Default header class is now `params__th--defaultvalue` (was `params__th--default`) to match its cells
  - Nullable and repeatable parameters show `<nullable>`, `<non-null>`, or `<repeatable>` in the Attributes column instead of a bare `true`
  - The Optional column shows `Yes` instead of `true`
- Nav items now use a `data-name` attribute instead of the invalid `name` attribute
- Generated docs no longer load highlight.js from a CDN, all code is highlighted while the docs are built
  - The README, changelog, and markdown descriptions now have their code blocks highlighted at build time like examples and source pages already were
  - If you were customizing the docs and relied on the global `hljs` object in the browser, it is no longer there

### New

- The engine exports an `escape` function for turning plain text into safe HTML: `escape('<b>') // => '&lt;b&gt;'`

### Changed

- Swapped `standard` and `snazzy` for `neostandard`, using ESLint's flat config
- Removed `npm-run-all`; tests now run through a single `tape` command
- Added a GitHub Actions workflow that lints, runs the tests on Node.js 22 and 24, and builds the example docs
- All files now use LF line endings, enforced through `.gitattributes`
- Updated development dependencies, clearing every `npm audit` warning
- Simplified the details list into a lookup table instead of a chain of `when` checks
- Simplified the parameter tables into a single list of column definitions
- Removed the internal `_appendǃ` helper
- Replaced `fs-extra` with Node's built in `node:fs/promises`, Pinet has one less dependency
- Updated `marked` to v18, `highlight.js` to v11.12.0, and `kyanite` to v3.2.0
- Highlighting is handled by one shared internal helper instead of being set up separately in each template

### Fixed

- `main` in `package.json` now points at `engine.js`, so `require('pinet')` and `import { compile } from 'pinet'` work instead of failing with `Cannot find module`
- Parameter tables no longer drop the "Optional?" header when a later parameter isn't optional
- Parameter tables no longer drop default values of `0`, `false`, or `''`
- Types like `Array.<String>` no longer break the page HTML
- Descriptions that are already HTML (like output from jsdoc's markdown plugin) are no longer wrapped in an extra `<p>`, which produced invalid nested `<p>` and `<ul>` elements
- Doclets without a description no longer show `undefined`
- Source pages now highlight the whole file instead of one character at a time, so keywords like `import` and `function` are actually highlighted
- Multiple `@example` blocks on one function are now separated by a new line instead of running together
- `@see` with multiple values now lists each one instead of joining them with commas
- An empty `@deprecated` tag now shows `Yes` instead of `true`
- Custom tags that aren't built in (like `recipe`) now show their value instead of the tag name as loose text
- `@sig`, `@signature`, and `@recipe` no longer create empty lines for files with Windows (`\r\n`) line endings
- Function titles separate multiple return types with `|` instead of `,`, matching the parameter tables
- "See Source" links now open a new tab each time (`target="_blank"`) instead of reusing a tab named `__blank`
- Pressing enter in the search now jumps to camelCase functions (like `addIndex`), the jump used a lowercased id before
- A source file that can't be read now skips that one source page instead of stopping the rest of the docs from being written
- A missing changelog file now reports the path it looked for, and other missing files are no longer reported as a missing changelog
- Removed the deprecated `hljs.initHighlightingOnLoad()` call, which logged a deprecation warning in the browser and re-highlighted code that was already highlighted
- Errors while writing the docs now make jsdoc exit with a failure code instead of `0`
  - `publish` now returns its promise, so jsdoc waits for every file to finish writing before it exits

## v1.2.1

### New

- Added support for `deprecated` tags

## v1.2.0

### New

- Now supports Dark mode!
  - Will enter dark or light mode based on users preference
- Added support for verbose in the jsdoc opts
  - Though right now its more or less the steps the engine is processing, this may grow into something more later
- Clicking on `See Source` in the documentation now opens in a new tab

### Fixed

- Mobile nav menu no longer looks weird
  - The blue box now takes up the full area rather than having padding on the sides
- Some loops that were running way to many times
- Removed extra steps that weren't needed anymore

### Chore

- Dependency Updates
- Some documentation updates on certain functions

## v1.1.5

- Dependency updates

## v1.1.4

- Dependency updates for packages
- Fixed some changes made by those updates

## v1.1.3

- Patched dependencies

## v1.1.2

- Patched dependencies

## v1.1.1

- Improved the search functionality so it will use fuzzySearch to try and figure out partial words when you hit enter
- Patched all dependencies
- Added prefix to search bar to stop blocking filter searches for functions named "filter"

## v1.1.0

- Added in a functionality that when a user hits enter after typing in search it will auto jump to that function
  - No more having to type and then click!
  - Clear the search bar and hit enter to go back to the top

## v1.0.2

- Patched highlight.js to 10.4.1

## v1.0.1

- Removed the examples folder, as it was misleading and not used/maintained
  - This should also address dependabot issues
- Added some code comments to publish.js to document it out a little bit better
- Changed the timing verbage from `write done` to `Time`
- Updated the html documentation to use v10.4.0 of highlight js CDN

## v1.0.0

- Full release
- Some slight optimizations to the engine
- Fixed naming conflicts with params
- Made generating sources optional with `genSources` option
- Removed unused code

## v0.2.3

- Bump the nav icon up so it is easier to see

## v0.2.2

- Fixed issue on chrome where hamburger icon was showing up off screen

## v0.2.1

- Fixed mobile menu peaking out on certain devices

## v0.2.0

- Changed the placeholder text to be more descriptive
- Added the recipes tag to the tag util support (Tag isn't supported html wise yet)
- Added support for source code links

## v0.1.2

- Removed unused libraries that were being used as tests and were never removed from the package.json
- Added support for a users changelog markdown file
- Tweaked how the page navigation works and looks to fit links better

## v0.1.1

- Made home page easier to read
- Fixed code blocks for home page
- Fixed image sizing issues for home page
- Created changelog

## v0.1.0

- Initial Release
