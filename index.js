const { readFileSync } = require('fs')
const { join, dirname } = require('path')
const { assign } = Object
const styleResolve = require('style-resolve')
const CssUrlRegex = require('css-url-regex')
const isWindows = require('is-windows')
const slash = require('slash')

const cssUrlRegex = CssUrlRegex()
const dotSlashRegex = /^[\.\/]*/
const quoteRegex = /["']*/g

module.exports = requireStyle

function requireStyle (name) {
  const path = styleResolve.sync(name)
  var css = readFileSync(path, 'utf8')
  
  // resolve any relative paths to absolute paths
  css = css.replace(cssUrlRegex, (_, url) => {
    url = url
      .replace(quoteRegex, '')
      .replace(dotSlashRegex, match => join(dirname(path), match))
    
    if (isWindows()) url = slash(url)

    return `url(${url})`
  })
  return css
}
