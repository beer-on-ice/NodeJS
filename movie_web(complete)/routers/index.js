let express = require('express')
let Movie = require('../app/models/movie')
let Category = require('../app/models/category')
let router = express.Router()


// index page
router.get('/',(req,res)=>{
    Category
    .find({})
    .populate({path: 'movies',options: {limit: 5}})
    .exec((err,categories)=>{
        if(err) {console.log(err);}
        else {
            res.render('pages/index',{
                title: '电影网站首页',
                categories: categories
            })
        }
    })
})

module.exports = router
