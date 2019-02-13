// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  globals: {
    'WeixinJSBridge' : false,
    'Vue' : false,
    '$' : false,
    'wx': false,
    "Swiper": true
  },
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-param-reassign': 2, //禁止给参数重新赋值
    'space-before-function-paren':'off',//关闭函数定义时括号前面必须有空格
    "camelcase": "off",//关闭强制驼峰法命名
    "quotes": "off", //关闭引号
  }
}
