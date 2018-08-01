const {Route} = require('../lib/decorator')
const {resolve} = require('path')

// 针对不同路由，生成对应的类
export const router = app => {
  const apiPath = resolve(__dirname, '../routes')
  const router = new Route(app, apiPath)
  router.init()
}
