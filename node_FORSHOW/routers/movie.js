var express = require('express')
var router = express.Router()
var Movie = require('../app/models/movie')
var Comment = require('../app/models/comment')


// 电影详情页
router.get('/:id',(req,res)=>{
    var id = req.params.id

    // 访问量增加
    Movie.update({_id: id},{$inc: {pv:1}},function(err) {
        if(err) console.log(err);
    })

    Movie.findById(id,function(err,movie) {
        Comment
        .find({movie:id})
        // 从from里根据objectId去User集合查，返回 键为name的
        .populate('from','name')
        .populate('reply.from reply.to','name')
        .exec(function(err,comments) {
            res.render('pages/detail',{
                title: '电影详情- ' + movie[0].title,
                movie: movie[0],
                comments: comments
            })
        })
    })

})

module.exports = router
