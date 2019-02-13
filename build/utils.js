var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var glob = require('glob')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

// 在exports挂上俩个方法
// 获取路口方法
exports.getEntries = function () {
  if (!/\*/.test(config.pageEntry)) {    
    // 单页入口处理    
    return {'index': config.pageEntry}  
  } else {    
    // 多页入口处理    
    var files = glob.sync(config.pageEntry)    
    var entries = {}    
    files.forEach(function (filepath) {      
      // 取倒数第二层(view下面的文件夹)做包名     
      var split = filepath.split('/')      
      var name = split[split.length - 2]      
      entries[name] = filepath    
    })   
    return entries  
  }
}

// connect-history-api-fallback 路由重写使用，
// https://github.com/bripkens/connect-history-api-fallback
exports.getRewrites = function () {
  var entries = exports.getEntries()
  var rewrites = []

  Object.keys(entries).forEach(function (name) {
    var reg = new RegExp('^\/' + name + '$')
    rewrites.push({from: reg, to: '\/' + name + '.html'})
  })

  return rewrites
}
