const mongoose = require('mongoose')
const Router = require('koa-router')
const router = new Router()

@controller('/api/v0/movies')
export class movieController {
  @get('/')
  @login //是否登录
  @admin(['developer']) // 是否开发者
  @log
  async getMovies (ctx,next) => {
    const Movie = mongoose.model('Movie')
    const movies = await Movie.find({}).sort({
      'meta.createdAt': -1
    })
    ctx.body = {
      movies
    }
  }

  @post
  @required({body:['username','doubanId']})

  @get('/:id')
  async getMovieDetail (ctx, next) => {
    const Movie = mongoose.model('Movie')
    const id = ctx.params.id
    const movie = await Movie.findOne({_id: id})
    ctx.body = {
      movie
    }
  }
}

module.exports = router
