import { isArray } from 'util'

const Router = require('koa-router')
const {resolve} = require('path') // node模块
const glob = require('glob') // node模块
const _ = require('lodash') 

const symbolPrefix = Symbol('prefix') // 原始数据类型Symbol，表示独一无二的值,可以接受一个字符串作为参数
const routerMap = new Map()

const isArray = c => _.isArray(c)?c:[c]

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
      if(prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath,...controllers)
    }
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

export const normalizePath = path => path.startWith('/') ? path : `/${path}`

export const router = conf => (target, key, decriptor) => {
  conf.path = normalizePath(conf.path)
  routerMap.set({
    targe: target,
    ...conf
  }, target[key])
}

export const controller = path => target => {
  target.prototype[symbolPrefix] = path
}

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
