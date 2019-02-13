var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    /*new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),*/
    new FriendlyErrorsPlugin()
  ]
})

// 添加下面的处理
var entries = utils.getEntries()
Object.keys(entries).forEach(function (name) {
  // 每个页面生成一个html
  const chunk = entries[name].slice(entries[name].lastIndexOf('/')+1).split('.')[0];
  var plugin = new HtmlWebpackPlugin({
    // 输出为 模块名称+html
    filename: name + '.html',
    //(模板放置对应的目录中，若用通用模板，则写 ‘index.html’)
    template: entries[name].slice(0, -3) + '.html', 
    inject: true,
    hash: process.env.NODE_ENV === 'production',
    chunks: ['vendors', chunk],
    multihtmlCache: true
  });
  module.exports.plugins.push(plugin)
})
