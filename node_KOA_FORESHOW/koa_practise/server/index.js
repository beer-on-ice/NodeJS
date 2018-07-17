const Koa = require('koa')
const logger = require('koa-logger')
const compose = require('koa-compose')
const session = require('koa-session')
const app = new Koa()
const mid1 = async (ctx, next) => {
  ctx.response.body = 'Hii, '
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

const mid = compose([mid1, mid2, mid3])

// function tail (i) {
//   if (i > 3) return i
//   console.log('修改前 ', i)
//   return tail(i + 1)
// }
// tail(0)

app.use(logger())

app.use(mid)
// app.use(mid1)
// app.use(mid2)
// app.use(mid3)

app.keys = ['Hi LUKE']
app.use(session(app))

app.use((ctx, next) => {
  if (ctx.path === '/favicon.ico') return
  if (ctx.path === '/') {
    let n = ctx.session.views || 0
    ctx.session.views = ++n
    ctx.body = ctx.body + '  ----' + n + ' views -----  '
  } else if (ctx.path == '/hi') {
    ctx.body = 'HI ,God'
  } else {
    ctx.body = '404'
  }
  next()
})

app.listen(8088)
