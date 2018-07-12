const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const {resolve} = require('path')

app.use(views(resolve(__dirname, './views'), {
  extension: 'pug' // 扩展名为pug的就会识别为模板文件
}))

app.use(async (ctx, next) => {
  await ctx.render('index', {
    you: 'Visitor',
    me: 'GENIUS'
  })
})
app.listen(8088)
