var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

var data;
/**
 * 处理通用数据
 */
router.use(function(req,res,next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    };
    // 读取所有分类
    Category.find().sort({_id: -1}).then(function(categories) {
        data.categories = categories;
        next();
    });
});

/**
    首页：
 * sort : 排序
 *  1： 升序
 *  -1： 降序
 */
router.get('/',function(req,res,next) {
    data.category = req.query.category || '';
    data.page = Number(req.query.page || 1);
    data.count = 0;
    data.limit = 4;
    data.pages = 0;
    var where = {};

    if(data.category) {
        where.category = data.category;
    }

 Content.where(where).count().then(function(count) {
        data.count = count;
        // 计算总页数
        data.pages = Math.ceil(data.count/data.limit);
        // 取值不能超过pages
        data.page = Math.min(data.page,data.pages);
        // 取值不能小于1
        data.page = Math.max(data.page,1);

        var skip = (data.page - 1) * data.limit;

        return Content.where(where).find().sort({addTime: -1}).limit(data.limit).skip(skip).populate(['category','user']);
    }).then(function(contents) {
        data.contents = contents;
        res.render('main/index',data);
    });

});

// 查看全文
router.get('/view',function(req,res) {
    var contentID = req.query.contentid || '';
    Content.findOne({
        _id: contentID
    }).then(function(content) {
        // console.log(content);
        data.content = content;
        // 阅读量
        content.views++;
        content.save();

        res.render('main/view',data);
    })
});



module.exports = router;
