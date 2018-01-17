'use strict'

const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

// add hot-reload related code to entry chunks
// Object.keys(baseWebpackConfig.entry).forEach(function (name) {
//   baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
// })

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true }),
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    // 注入变量 base 中统一处理 webpack.DefinePlugin
    // new webpack.DefinePlugin({
    //   'process.env': config.dev.env
    // }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: config.template,
      inject: true,
      favicon: config.favicon,
      title: 'kit-admin',
      serviceWorkerLoader: `<script>${fs.readFileSync(path.join(__dirname,
        './service-worker-dev.js'), 'utf-8')}</script>`
    }),
    new FriendlyErrorsPlugin(),
  ]
})

module.exports = devWebpackConfig
// module.exports = new Promise((resolve, reject) => {
//   portfinder.basePort = process.env.PORT || config.dev.port
//   portfinder.getPort((err, port) => {
//     if (err) {
//       reject(err)
//     } else {
//       // publish the new Port, necessary for e2e tests
//       process.env.PORT = port
//       // add port to devServer config
//       devWebpackConfig.devServer.port = port

//       // Add FriendlyErrorsPlugin
//       devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
//         compilationSuccessInfo: {
//           messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
//         },
//         onErrors: config.dev.notifyOnErrors
//         ? utils.createNotifierCallback()
//         : undefined
//       }))

//       resolve(devWebpackConfig)
//     }
//   })
// })
