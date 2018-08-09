const Koa = require('koa')
const views = require('koa-views')
const static = require('koa-static')
const {resolve} = require('path')
const app = new Koa()

const r = path => resolve(__dirname, path)

app.use(static(r('./views')))
app.use(views(r('./views'), {extension: 'pug'}))

app.use(async ctx => {
  await ctx.render('index', {name: '超级大天才'})
})

app.listen(3000, () => {
  console.log('Server Start in Port 3000')
})
