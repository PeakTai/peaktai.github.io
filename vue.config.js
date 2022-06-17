const pages = require('./vue.config.pages.json')

module.exports = {
  productionSourceMap: false,
  filenameHashing: false,
  parallel: true,
  lintOnSave: true,
  outputDir: './docs',
  runtimeCompiler: true,
  pages,
  chainWebpack: config => {
    const fontsRule = config.module.rule('fonts')
    // 清除原有配置
    fontsRule.uses.clear()
    fontsRule
      .use('url-loader')
      .loader('url-loader')
      .tap(() => {
        return {
          esModule: false,
          name: '[name].[ext]',
          limit: 10240,
          outputPath: 'fonts/'
        }
      })
    // raw Loader
    config.module
      .rule('text')
      .test(/\.(txt|md)$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  }
}
