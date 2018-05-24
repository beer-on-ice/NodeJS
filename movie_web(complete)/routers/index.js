let express = require('express')
let Movie = require('../app/models/movie')
let router = express.Router()


// index page
router.get('/',(req,res)=>{
    Movie.fetch(function(err,movies) {
        if(err) {console.log(err);}
        else {
            res.render('pages/index',{
                title: '电影网站首页',
                movies: movies
            })
        }
    })
})

module.exports = router
