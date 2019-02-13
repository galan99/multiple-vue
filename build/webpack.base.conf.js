var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

const HappyPack = require('happypack');
const os = require('os');
const happThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});
var webpack = require('webpack')
const AutoDllPlugin = require('autodll-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: utils.getEntries(),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  externals: {
      'vue': 'Vue',
      'swiper': 'Swiper'
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'happypack/loader?id=js' // 将loader换成happypack
          }
        }
      },
      {
        test: /\.js$/,
        loader: ['happypack/loader?id=js'], // 将loader换成happypack
        include: [resolve('src')], // src是项目开发的目录
        exclude: [path.resolve('../../node_modules')]
      },
      {
        test: /\.css$/,
        loaders: ExtractTextPlugin.extract({ 
          fallback: 'style-loader', 
          use: 'css-loader' 
        }),
        exclude: /node_modules/
      }, 
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:5].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:5].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:5].[ext]')
        }
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'js',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happThreadPool
    }),
  ],
}
