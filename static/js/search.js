const search = document.getElementById('pinetFilter')
const navItems = Array.from(document.querySelectorAll('.nav__item'))
// Maps the lowercase name used for searching back to the real name, since ids are case sensitive
const functionMap = new Map(navItems.map(el => {
  const name = el.getAttribute('data-name')

  return [name.toLowerCase(), name]
}))

/* eslint-disable no-labels */

/* global hljs, location */

hljs.initHighlightingOnLoad()

// FuzzySearch taken directly from kyanite!
const fuzzySearch = (needle, haystack) => {
  const hLen = haystack.length
  const nLen = needle.length
  let j = 0

  if (nLen > hLen) {
    return false
  }

  if (nLen === hLen) {
    return needle === haystack
  }

  outer: for (let i = 0; i < nLen; i++) {
    const nChar = needle.charCodeAt(i)

    for (j; j < hLen; j++) {
      if (haystack.charCodeAt(j) === nChar) {
        continue outer
      }
    }

    return false
  }

  return true
}

search.onkeyup = ({ key, target }) => {
  const search = target.value.toLowerCase()

  if (key.toLowerCase() === 'enter') {
    if (functionMap.has(search)) {
      location.hash = functionMap.get(search)

      return true
    }

    for (const [lower, name] of functionMap) {
      if (fuzzySearch(search, lower)) {
        location.hash = name

        return true
      }
    }
  }

  return false
}

search.oninput = ({ target }) => {
  const val = target.value.toLowerCase()

  navItems.forEach(el => {
    if (fuzzySearch(val, el.innerText.toLowerCase()) ||
      fuzzySearch(val, el.getAttribute('data-cat').toLowerCase())) {
      el.classList.remove('hidden')
    } else {
      el.classList.add('hidden')
    }
  })
}
