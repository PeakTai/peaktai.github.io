const { marked } = require('marked')
const hljs = require('highlight.js')

module.exports = function (source) {
  const html = marked(source, {
    highlight: (code, language) => {
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
      return hljs.highlight(validLanguage, code).value
    }
  })
  return html
}
