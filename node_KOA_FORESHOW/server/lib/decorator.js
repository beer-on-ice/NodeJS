/**
 * 此部分主要是想通过修饰器将不同路由下的事件处理通过class包装成一个独立的类
 */
const Router = require('koa-router')
const {resolve} = require('path') // node模块
const glob = require('glob') // node模块
const _ = require('lodash')

const symbolPrefix = Symbol('prefix') // 原始数据类型Symbol，表示独一无二的值,可以接受一个字符串作为参数
const routerMap = new Map()

const isArray = c => _.isArray(c) ? c : [c]

export class Route {
  constructor (app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }
  init () {
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)

    for (let [conf, controller] of routerMap) {
      const controllers = isArray(controller)
      const prefixPath = conf.target[symbolPrefix]

      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path // 完整路径
      /**
       * 相当于 let tmp = new Router()
       * tmp.get(path, function)
       * tmp.use(path, function)
       */
      this.router[conf.method](routerPath, ...controllers)
    }
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

const normalizePath = path => path.startsWith('/') ? path : `/${path}`

// conf: get/post等方法传递的参数（如：{method: 'get',path: path}），最终已 {类方法，传递的参数}为键， {原型方法} 为值 生成routerMap
const router = conf => (target, key, decriptor) => {
  conf.path = normalizePath(conf.path)
  routerMap.set({
    target: target,
    ...conf
  }, target[key])
}

// 修饰器，给每个（如：movieController）类加上特有的prototype
export const controller = path => target => {
  target.prototype[symbolPrefix] = path
}

// 修饰器，给每个原型方法（如：getMovies）通过router进行处理
export const get = path => router({
  method: 'get',
  path: path
})

export const post = path => router({
  method: 'post',
  path: path
})

export const put = path => router({
  method: 'put',
  path: path
})

export const del = path => router({
  method: 'del',
  path: path
})

export const use = path => router({
  method: 'use',
  path: path
})

export const all = path => router({
  method: 'all',
  path: path
})
