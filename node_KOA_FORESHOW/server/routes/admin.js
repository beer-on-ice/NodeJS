 const mongoose = require('mongoose')
const Router = require('koa-router')
const router = new Router()
const {
  controller,
  get,
  post,
  put,
  auth,
  admin,
  del,
  required
} = require('../lib/decorator')
const {
  checkPassword
} = require('../service/user')
const {
  getAllMovies,
  fineAndRemove
} = require('../service/movie')


@controller('/admin')
export class adminController {
  @get('/movie/list')
  @auth     // 检测是否登录
  @admin('admin')
  async getMovieList (ctx,next) {
    const movies = await getAllMovies()
    ctx.body = {
      success: true,
      data: movies
    }
  }

  @del('/movies')
  @required({
    query: ['id']
  })
  async remove (ctx,next) {
    const id = ctx.query.id
    const movie = await fineAndRemove(id)
    const movies = await getAllMovies()

    ctx.body = {
      data: movies,
      success:true
    }
  }

  @post('/login')
  @required({
    body: ['email','password']
  })
  async login (ctx,next) {
    const {email,password} = ctx.request.body
    
    const matchData = await checkPassword(email,password)
    
    if(!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在'
      })
    }
    if(matchData.match) {
      ctx.session.user = {
        _id: matchData.user._id,
        email: matchData.user.email,
        role: matchData.user.role,
        username: matchData.user.username
      }
      return (ctx.body = {
        success: true
      })
    }
    return (ctx.body = {
      success: false,
      err: '密码不正确'
    })
  }
}
