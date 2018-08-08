const Koa = require('koa')
const {resolve} = require('path')
const { connect, initSchemas, initAdmin } = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['common', 'router', 'parcel']

const useMiddlewares = (app) => {
  R.map( // 数组的每个成员依次执行某个函数
    R.compose( // 将多个函数合并成一个函数，从右到左执行。
      R.forEachObjIndexed( // 每个属性依次执行给定函数，给定函数的参数分别是属性值和属性名，返回原对象。
        initWith => initWith(app) // 将app传进引入的router.js
      ),
      require, // 引入并命名为initWith
      name => resolve(__dirname, `./middlewares/${name}`)// 返回middlewares下router.js
    )
  )(MIDDLEWARES) // 即函数里 name
}

;(async () => {
  await connect()

  // 初始化数据库结构
  initSchemas()

  // 初始化管理员
  await initAdmin()

  const app = new Koa()

  await useMiddlewares(app)

  app.listen(8088)
})()
