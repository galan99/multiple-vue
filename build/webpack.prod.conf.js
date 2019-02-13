var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const env = config.build.env
const entries = utils.getEntries();
let jsList = [];
Object.keys(entries).forEach(function (name) {
  jsList.push(name)
})

console.log(jsList)
console.log(process.env.mock === true)

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[id].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    
    // extract css into its own file //js/[id].[chunkhash:3].js
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/common.css')
    }),

    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? {safe: true, map: {inline: false}}
        : {safe: true}
    }),

    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: "main", // <== should be entry key which contains the lazy imports
      async: true,
      minChunks: 2           
    }),
    // 压缩代码
		new webpack.optimize.UglifyJsPlugin({
			compress: {
        warnings: false,
        drop_console: false
			},
      sourceMap: true,
		}),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

// 添加下面的处理


Object.keys(entries).forEach(function (name) {
  // 每个页面生成一个html
  const chunks = ['manifest', 'vendor', name,]
  var plugin = new HtmlWebpackPlugin({
    filename: name + '.html',
    template: entries[name].slice(0, -3) + '.html',
    inject: true,
    chunks,
    minify: {
      removeComments: false,
      collapseWhitespace: false,
      removeAttributeQuotes: false
    },
    chunksSortMode: function (chunk1, chunk2) {
      const orders = chunks
      const order1 = orders.indexOf(chunk1.names[0])
      const order2 = orders.indexOf(chunk2.names[0])
      return order1 - order2
    },
    // 每个包引入自己的依赖，公共依赖
  });

  webpackConfig.plugins.push(plugin)
})


module.exports = webpackConfig


