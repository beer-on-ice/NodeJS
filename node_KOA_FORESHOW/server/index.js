const Koa = require('koa')
const cors = require('koa2-cors')
const views = require('koa-views')
const {resolve} = require('path')
const {connect} = require('./database/init')
const app = new Koa()

;(async () => {
  await connect()
})()

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
