var express = require('express')
var router = express.Router()
var _underscore = require('underscore')
var Movie = require('./../models/movie')
var User = require('../models/user')

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
router.get('/update/:id',function(req,res) {
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

// post movie
router.post('/movie/new',function(req,res) {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie = null;

    if((typeof id) !== 'undefined') {
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

// list page
router.get('/list',(req,res)=>{
    Movie.fetch(function(err,movies) {
        if(err) {console.log(err)}
        res.render('pages/list',{
      title: '电影列表',
      movies: movies
    })
    })
})

router.delete('/list',function(req,res) {
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

// userlist
router.get('/userlist',(req,res)=>{
    User.fetch(function(err,users) {
        if(err) {console.log(err)}
        res.render('pages/userlist',{
          title: '用户列表',
          users: users
        })
    })
})


module.exports = router
