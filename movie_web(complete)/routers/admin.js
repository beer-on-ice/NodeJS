var express = require('express')
var router = express.Router()
var _ = require('underscore')
var Movie = require('../app/models/movie')
var User = require('../app/models/user')
var Comment = require('../app/models/comment')
var Category = require('../app/models/category')

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

// 电影录入
router.get('/movie',(req,res)=>{
    Category.find({},(err,categories)=>{
        res.render('pages/movie',{
            title: '电影录入',
            categories: categories,
            movie: {
                // title: '',
                // director: '',
                // country: '',
                // year: '',
                // poster: '',
                // flash: '',
                // summary: '',
                // language: ''
            }
        })
    })
})

// 修改电影信息
router.get('/update/:id',function(req,res) {
    var id = req.params.id
    if(id) {
        Movie.findById(id,function(err,movie) {
            Category.find({},(err,categories)=>{
                res.render('pages/movie',{
                    title: '后台更新页',
                    movie: movie[0],
                    categories:categories
                })
            })
        })
    }
})

// 电影列表
router.get('/movielist',(req,res)=>{
    Movie.fetch(function(err,movies) {
        if(err) {console.log(err)}
        res.render('pages/list',{
            title: '电影列表',
            movies: movies
        })
    })
})

// 删除电影
router.delete('/movielist',function(req,res) {
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

// 创建新电影
router.post('/movie/new',function(req,res) {
    var movieObj = req.body.movie
    var id = movieObj._id
    var _movie = null;
    if(id) {
        // console.log(movieObj);
        Movie.update({_id:id}, movieObj ,function(err,news) {
            if(err) console.log(err);
            res.redirect('/movie/'+ movieObj._id)
        })
        // ----------------- underscore更新有问题
        // Movie.findById(id,function(err,movie) {
        //     if(err) {console.log(err)}
        //     _movie = _.extend(movie,movieObj)
        //     _movie.save(function(err,movies) {
        //         if(err) {console.log(err)}
        //         res.redirect('/movie/'+movies._id)
        //     })
        // })
    }
    else {
        _movie = new Movie(movieObj)
        var categoryId = _movie.category

        _movie.save(function(err,movie) {
            if(err) {console.log(err)}

            Category.update({_id:categoryId}, {'$push':{movies:movie._id} } ,function(err,news) {
                if(err) console.log(err);
                res.redirect('/movie/'+ movie._id)
            } );

        })
    }
})

// 用户列表-只有管理员能进
router.get('/userlist',(req,res)=>{
    User.fetch(function(err,users) {
        if(err) {console.log(err)}
        res.render('pages/userlist',{
            title: '用户列表',
            users: users
        })
    })
})

// 评论
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
            if(err) console.log(err);
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

// 分类录入
router.get('/category',(req,res)=>{
    res.render('pages/category',{
        title: '分类录入页',
        category: {}
    })
})

// 分类列表-只有管理员能进
router.get('/categorylist',(req,res)=>{
    Category.fetch(function(err,categories) {
        if(err) {console.log(err)}
        res.render('pages/categorylist',{
            title: '分类列表',
            categories: categories
        })
    })
})

// 创建新分类
router.post('/category/new',function(req,res) {
    var _category = req.body.category

    var category = new Category(_category)
    category.save(function(err,category) {
        if(err) {console.log(err)}
        res.redirect('/admin/categorylist')
    })
})

module.exports = router
