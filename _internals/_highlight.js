const hljs = require('highlight.js')

const entities = { lt: '<', gt: '>', quot: '"', apos: "'", amp: '&' }

/**
 * Turns the html entities inside an already escaped code block back into plain text
 * @private
 * @param {String} str The escaped string
 * @returns {String} The plain text
 */
function decode (str) {
  return str.replace(/&(#x[\da-f]+|#\d+|lt|gt|quot|apos|amp);/gi, (match, name) => {
    if (name[0] !== '#') {
      return entities[name.toLowerCase()]
    }

    return name[1].toLowerCase() === 'x'
      ? String.fromCodePoint(parseInt(name.slice(2), 16))
      : String.fromCodePoint(parseInt(name.slice(1), 10))
  })
}

/**
 * Highlights a block of code, when no language is given highlight.js guesses it
 * Languages highlight.js doesn't know (like `cli`) are escaped but left unhighlighted
 * @private
 * @param {String} code The plain text code to highlight
 * @param {String} [language] The language of the code
 * @returns {String} The highlighted html
 */
function highlight (code, language) {
  if (!language) {
    return hljs.highlightAuto(code).value
  }

  return hljs.getLanguage(language)
    ? hljs.highlight(code, { language }).value
    : hljs.highlight(code, { language: 'plaintext' }).value
}

/**
 * Finds the language from a `lang-x` or `language-x` class in the given attributes
 * @private
 * @param {String} attrs The attribute string of an element
 * @returns {String|undefined} The language if one was found
 */
function findLanguage (attrs) {
  const match = /class="[^"]*\blang(?:uage)?-([\w+#-]+)/.exec(attrs)

  return match ? match[1] : undefined
}

/**
 * Highlights every `<pre><code>` block in an html string that isn't highlighted yet
 * This covers the README, the changelog, and markdown descriptions, which come to us as html
 * @private
 * @param {String} html The html to search for code blocks
 * @returns {String} The html with its code blocks highlighted
 */
function highlightBlocks (html = '') {
  return html.replace(/<pre([^>]*)><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (block, preAttrs, codeAttrs, body) => {
    if (/class="[^"]*\bhljs\b/.test(codeAttrs)) {
      return block
    }

    const language = findLanguage(codeAttrs) || findLanguage(preAttrs)
    const cls = language ? `hljs language-${language}` : 'hljs'

    return `<pre${preAttrs}><code class="${cls}">${highlight(decode(body), language)}</code></pre>`
  })
}

module.exports = { highlight, highlightBlocks }
