var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
/**
    首页：
 * sort : 排序
 *  1： 升序
 *  -1： 降序
 */
router.get('/',function(req,res,next) {
    var data= {
        page: Number(req.query.page || 1),
        limit: 4,
        pages: 0,
        count: 0,

        userInfo: req.userInfo,
        categories: [],
        category:req.query.category || ''
    }
    var where = {};

    if(data.category) {
        where.category = data.category;
    }

    Category.find().sort({_id: -1}).then(function(categories) {
        // 读取所有分类
        data.categories = categories;
        return Content.where(where).count();
    }).then(function(count) {
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

module.exports = router;
