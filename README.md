# [vue-cli配置文章介绍](http://www.jianshu.com/p/be57e081c0f3)

# 预览效果

<img src="./pic/1.png" width="60%"/>

vue是目前灰常火的前端框架，但是我们在开发pc的web端时经常需要用到多页系统，而不是简单的单页系统，而vue-cli(最好用的脚手架)只有单页应用的的脚手架，要配置一个自己能用的vue多页应用的脚手架有以下修改的地方

***

## 目录结构

```bash
├── build # build folder
│   ├── build.js
│   ├── check-versions.js
│   ├── dev-client.js
│   ├── dev-server.js
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   ├── webpack.dll.conf.js
│   └── webpack.prod.conf.js
│
├── config # config part
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
│
├── static # static part
│
├── src  # main folder
│   ├── assets  # 公共静态资源
│   │   ├── img
│   │   │   └── logo.png
│   │   ├── js
│   │   └── css
│   │
│   ├── components # 公共组件
│   │   ├── Rule.vue
│   │   │
│   │   ├── Timedown.vue
│   │   │
│   │   ├── users.vue
│   │   │
│   │   ├── Gametime.vue
│   │   │
│   │   ├── toast
│   │   │   ├── index.js
│   │   │   └── toast.vue
│   │   │
│   │   └── loading
│   │       ├── index.js
│   │       └── loading.vue
│   │
│   ├── mock # 模拟数据
│   │
│   │
│   │
│   ├── utils # 公共方法
│   │   └── index.js
│   │
│   └── views  # 路由页面
│       ├── create  # create part 
│       │   ├──create.html # create.html 
│       │   ├──create.js  # entry js
│       │   └──create.vue  # create vue
│       │
│       │
│       ├── jinli  # jinli part 
│       │   ├──jinli.html # jinli.html 
│       │   ├──jinli.js  # entry js
│       │   └──jinli.vue  # jinli vue
│       │
│       │
│       ├── money  # money part 
│       │   ├──money.html # money.html 
│       │   ├──money.js  # entry js
│       │   └──money.vue  # money vue
│       │
│       │
│       ├── on  # on part 
│       │   ├──on.html # on.html 
│       │   ├──on.js  # entry js
│       │   └──on.vue  # on vue
│       │
│       └── page # page part
│           │
│           ├──page.html # page.html 
│           ├──page.js  # entry js
│           └──page.vue  # page vue
├── LICENSE
├── .babelrc          # babel config (es2015 default)
├── .eslintrc.js      # eslint config (eslint-config-vue default)
├── package.json
└── README.md
```

> 1.改造 config/index.js

```java (type)
module.exports = {
  build: {...},
  dev: {...},
  // 添加下面两项，根据自己要求配置
  pageEntry: './src/views/**/*.js' // 多页应用入口
  // pageEntry: './src/main.js' // 单页应用入口
}
```


> 2.改造 build/utils.js

安装 npm install --save-dev glob 包

```java (type)
var glob = require('glob') // 引入glob包

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
```

> 3.改造 build/webpack.base.conf.js

```java (type)
...
module.exports = {
  entry: utils.getEntries()
}
...
```

> 4.改造 build/webpack.dev.conf.js

```java (type)
...
module.exports = {
  ...
  plugins: [
    ...
    // https://github.com/ampedandwired/html-webpack-plugin
    /* 注释或者删除下面插件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }), */
    ...
  ]
}
...

// 添加下面的处理
var entries = utils.getEntries()
Object.keys(entries).forEach(function (name) {
  // 每个页面生成一个html
  console.log(entries[name])
  const chunk = entries[name].slice(entries[name].lastIndexOf('/')+1).split('.')[0]; 
  var plugin = new HtmlWebpackPlugin({
    // 输出为 模块名称+html
    filename: name + '.html',
    //(模板放置对应的目录中，若用通用模板，则写 ‘index.html’)
    template: entries[name].slice(0, -3) + '.html', 
    inject: true,
    hash: process.env.NODE_ENV === 'production',
    chunks: ['vendors', chunk]
  });
  module.exports.plugins.push(plugin)
})
```

> 5.改造 build/dev-server.js

```java (type)
// 引入utils包
var utils = require('./utils')
...
// 修改history，参数，使访问的效果如预期访问效果
// 访问xxxx/login.html -> xxxx/login
app.use(require('connect-history-api-fallback')(
  {rewrites: utils.getRewrites()}
))
...
```

## 以上是将dev开发模式改造完成

> 6.改造 build/webpack.prod.conf.js

```java (type)
...
var webpackConfig = merge(baseWebpackConfig, {
  ...
  /* 注释或者删除下面插件
  new HtmlWebpackPlugin({
    filename: config.build.index,
    template: 'index.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
    chunksSortMode: 'dependency'
  }),*/
  ...
})

// 添加下面的处理
var entries = utils.getEntries()
Object.keys(entries).forEach(function (name) {
  // 每个页面生成一个html
  var plugin = new HtmlWebpackPlugin({
    filename: name + '.html',
    template: entries[name].slice(0, -3) + '.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
    chunksSortMode: 'dependency',
    // 每个包引入自己的依赖，公共依赖
    chunks: ['manifest', 'vendor', name],
    hash: true
  });

  webpackConfig.plugins.push(plugin)
})
```

# 已加上构建优化，改造完成，然后执行以下命令

``` bash

cdn引入Vue.js v2.5.2

# 安装依赖的库
npm install

# 开发环境
npm run dev

# 生产环境
npm run build

```

