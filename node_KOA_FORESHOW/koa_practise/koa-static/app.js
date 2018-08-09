const Koa = require('koa')
const static = require('koa-static')
const {resolve} = require('path')
const app = new Koa()

const r = path => resolve(__dirname, path)

app.use(static(r('./static')))

app.use(async ctx => {
  ctx.body = '123'
})

app.listen(3000, () => {
  console.log('Server Start in Port 3000')
})
