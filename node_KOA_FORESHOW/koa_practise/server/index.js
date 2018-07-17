const Koa = require('koa')
const logger = require('koa-logger')
const app = new Koa()
const mid1 = async (ctx, next) => {
  ctx.body = 'Hi, '
  ctx.type = 'text/html; charset=utf-8'
  await next()
  ctx.body = ctx.body + ' 1'
}
const mid2 = async (ctx, next) => {
  ctx.body = ctx.body + ' 2 '
  await next()
  ctx.body = ctx.body + ' 3'
}
const mid3 = async (ctx, next) => {
  ctx.body = ctx.body + 'Genius'
  await next()
  ctx.body = ctx.body + ' 4'
}

function tail (i) {
  if (i > 3) return i
  console.log('修改前 ', i)
  return tail(i + 1)
}
tail(0)

app.use(logger())
app.use(mid1)
app.use(mid2)
app.use(mid3)

app.listen(8088)
