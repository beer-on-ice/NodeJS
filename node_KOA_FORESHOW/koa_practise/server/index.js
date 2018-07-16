const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = 'HI,Li'
})

app.listen(8088)
