const pages = require('./vue.config.pages.json')
var webpack = require('webpack')
const path = require('path')

module.exports = {
  productionSourceMap: false,
  filenameHashing: false,
  parallel: true,
  lintOnSave: true,
  outputDir: './docs',
  pages,
  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ],
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            {
              loader: 'raw-loader'
            },
            {
              loader: path.resolve(__dirname, 'markdown-loader.js')
            }
          ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        minChunks: 1,
        minSize: 1024 * 1024 * 100
      }
    }
  },
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
  }
}
