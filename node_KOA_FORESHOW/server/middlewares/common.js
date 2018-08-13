import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import session from 'koa-session'

// 解析post请求
export const addBodyParser = app => {
  app.use(bodyParser())
}
// 替换console.log输出的一个插件
export const addLogger = app => {
  app.use(logger())
}

// koa-session
export const addSession = app => {
  app.keys = ['genius']

  const CONFIG = {
    key: 'koa:sess', // cookie key (default is koa:sess)
    maxAge: 86400000, // 确定cookie的有效期
    overwrite: true, // 是否可以overwrite
    httpOnly: false, // 表示是否可以通过javascript来修改，设成true会更加安全
    signed: true, // 签名默认true
    rolling: false // 涉及到cookie有效期的更新策略
  }

  app.use(session(CONFIG, app))
}
