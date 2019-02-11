const { concat } = require('kyanite')
const { compile, meta } = require('../engine')

function buildMeta (metaArr) {
  if (!metaArr) {
    return []
  }

  return metaArr.map(meta)
}

function layout (opts, children = []) {
  return concat(compile('html', { lang: opts.lang || 'en' }, [
    compile('head', {}, [
      ...buildMeta(opts.meta),
      compile('title', {}, opts.title || 'Documentation')
    ]),
    compile('body', { id: 'root' }, children)
  ]), '<!DOCTYPE html>')
}

module.exports = layout
