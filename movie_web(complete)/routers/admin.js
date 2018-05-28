var express = require('express')
var router = express.Router()
var _underscore = require('underscore')
var Movie = require('../app/models/movie')
var User = require('../app/models/user')
var Comment = require('../app/models/comment')

// 中间件检测是否已经登录
router.use(function(req,res,next) {
    let user = req.session.user

    if(!user) {
        return res.redirect('/user/signin')
    }
    next()
})

// 中间件检测是否是管理员
router.use(function(req,res,next) {
    let user = req.session.user

    if(user.role <= 10) {
        return res.redirect('/user/signin')
    }
    next()
})

// admin page
router.get('/movie',(req,res)=>{
    res.render('pages/admin',{
      title: '电影录入',
      movie: {
        title: '',
        director: '',
        country: '',
        year: '',
        poster: '',
        flash: '',
        summary: '',
        language: ''
      }
    })
})

// update movie
router.get('/movie/update/:id',function(req,res) {
    var id = req.params.id
    if(id) {
        Movie.findById(id,function(err,movie) {
            res.render('pages/admin',{
                title: '后台更新页',
                movie: movie[0]
            })
        })
    }
})

// 创建新电影
router.post('/movie/new',function(req,res) {
    var movieObj = req.body.movie
    var id = movieObj._id
    var _movie = null;

    if(id) {
        Movie.findById(id,function(err,movie) {
            if(err) {console.log(err)}
            _movie = _underscore.extend(movie,movieObj)
            _movie.save(function(err,movies) {
                if(err) {console.log(err)}
                res.redirect('/movie/'+movies._id)
            })
        })
    }
    else {
        _movie = new Movie({
            director: movieObj.director,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        _movie.save(function(err,movie) {
            if(err) {console.log(err)}
            res.redirect('/movie/'+ movie._id)
        })
    }
})

// 电影列表
router.get('/movie/list',(req,res)=>{
    Movie.fetch(function(err,movies) {
        if(err) {console.log(err)}
        res.render('pages/list',{
          title: '电影列表',
          movies: movies
        })
    })
})

// 删除电影
router.delete('/movie/list',function(req,res) {
    var id = req.query.id
    if(id) {
        Movie.remove({_id:id},function(err,movie) {
            if(err) {
                console.log(err);
            }
            else {
                res.json({success:1})
            }
        })
    }
})


// 用户列表-只有管理员能进
router.get('/user/userlist',(req,res)=>{
    User.fetch(function(err,users) {
        if(err) {console.log(err)}
        res.render('pages/userlist',{
            title: '用户列表',
            users: users
        })
    })
})

router.post('/comment',(req,res)=>{
    let _comment = req.body.comment
    let movieId = _comment.movie
    // 回复
    if(_comment.cid) {
        // 根据当前评论的_id找到当前评论
        // $addToSet: 不允许重复; $push: 可以重复
        var reply =  {
            from:  _comment.from,    // 做出回复的人的id（即当前登陆用户）
            to: _comment.tid,         // 要回复的人的id（即这条评论发布者）
            content: _comment.content
        }
        Comment.update({_id:_comment.cid}, {'$push':{reply:reply} } ,function(err,news) {
            if(err)console.log(err);
            res.redirect('/movie/'+ movieId)
        } );
    }
    else {
        let comment = new Comment(_comment)
        comment.save(function(err,comment) {
            if(err) console.log(err);
            res.redirect('/movie/'+ movieId)
        })
    }
})

module.exports = router
