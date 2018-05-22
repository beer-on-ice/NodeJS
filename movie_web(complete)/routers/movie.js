var express = require('express')
var router = express.Router()
var Movie = require('./../models/movie')

// detail page
router.get('/:id',(req,res)=>{
    var id = req.params.id
    Movie.findById(id,function(err,movie) {
        if(err) {console.log(err);}
        else {
            res.render('pages/detail',{
                title: '电影详情- ' + movie[0].title,
                movie: movie[0]
            })
        }
    })

})

module.exports = router
