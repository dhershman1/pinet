const { concat } = require('kyanite')
const { compile } = require('../engine')

function layout (opts, children = []) {
  return concat(compile('html', { lang: opts.lang || 'en' }, [
    compile('body', { id: 'root' }, children)
  ]), '<!DOCTYPE html>')
}

module.exports = layout
