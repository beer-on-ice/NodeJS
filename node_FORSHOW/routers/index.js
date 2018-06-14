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
router.get('/results',(req,res)=>{
    var catId = req.query.cat
    var q = req.query.q
    var page = req.query.p || 1 // 第几页
    var count = 3 // 每页几条
    var categoryName = ''
    if(catId) {
        Category.find({_id: catId},function(err,category) {
            if (err) console.log(err)
            categoryName = category[0].name
        })
        Movie.findPaginated({category: catId}, function (err, result) {
            if (err) console.log(err)
            res.render('pages/results',{
                title: '该分类下电影',
                query: 'cat='+ catId,
                keyword: categoryName,
                currentPage: page,
                totalPages: result.totalPages,
                category: result.documents
            })
            // 第一个参数是 每页几条 ， 第二个参数是 第几页
        }, count, page);
    }
    else {
        Movie
        .findPaginated({title: new RegExp(q+'.*','i')}, function(err,movies) {
            if(err) throw err
            res.render('pages/results',{
                title: '搜索到的电影',
                query: 'q='+ q,
                keyword: '搜索关键词： ' + q,
                currentPage: page,
                totalPages: movies.totalPages,
                category: movies.documents
            })
        }, count, page)
    }
})

module.exports = router
