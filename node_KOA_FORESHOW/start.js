// 引入babel-register之后所有require并以.es6, .es, .jsx 和 .js为后缀的模块都会经过babel的转译。
require('babel-register')
// 用已经存在的语法和api实现一些浏览器还没有实现的api，对浏览器的一些缺陷做一些修补
require('babel-polyfill')
require('./server/index.js')
