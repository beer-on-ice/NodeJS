const Koa = require('koa')
const {resolve} = require('path')
const { connect, initSchemas, initAdmin } = require('./database/init')
const R = require('ramda') // 函数式编程库
const MIDDLEWARES = ['common', 'router', 'parcel']

const useMiddlewares = (app) => {
  R.map( // 数组的每个成员依次执行某个函数
    R.compose( // 将多个函数合并成一个函数，从右到左执行。
      R.forEachObjIndexed( // 每个属性依次执行给定函数，给定函数的参数分别是属性值和属性名，返回原对象。
        initWith => initWith(app) // 将app传进引入的router.js
        // function (initWith) {
        //   console.log(initWith)
        //   return initWith(app)
        // }
      ),
      require, // 引入并命名为initWith
      // function (path) {
      //   console.log(path)
      //   let tmp = require(path)
      //   console.log(tmp)
      // },
      name => resolve(__dirname, `./middlewares/${name}`)// 返回middlewares下文件完整路径
    )
  )(MIDDLEWARES) // 即函数里 name
}

;(async () => {
  // 连接数据库
  await connect()

  // 初始化数据库结构
  initSchemas()

  // 初始化管理员
  await initAdmin()

  const app = new Koa()

  // 使用中间件
  await useMiddlewares(app)

  app.listen(8088)
})()
