const Bundler = require('parcel-bundler')
const views = require('koa-views')
const serve = require('koa-static')
const {resolve} = require('path')

const r = path => resolve(__dirname, path)

const bundler = new Bundler(r('../../../src/index.html'), {
  publicUrl: './', // 静态资源的 url ，默认为 dist
  watch: true// 是否需要监听文件并在发生改变时重新编译它们，默认为 process.env.NODE_ENV !== 'production'
})

export const dev = async app => {
  await bundler.bundle()
  app.use(serve(r('../../../dist')))
  app.use(views(r('../../../dist')), { extension: 'html' })
  app.use(async (ctx) => {
    await ctx.render('index.html')
  })
}
