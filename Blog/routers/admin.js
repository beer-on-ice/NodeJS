var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function(req,res,next) {
    if(!req.userInfo.isAdmin) {
        // 如果当前用户非管理员
        res.send('对不起，只有管理员才可以进入后台管理！');
        return;
    }
    next();
});

// 首页
router.get('/',function(req,res,next) {
    res.render('admin/index',{
        userInfo: req.userInfo
    })
});

// 用户管理
router.get('/user',function(req,res) {
    /**
     * 从数据库中读取所有的用户数据
     *  limit(Number): 限制获取的数据条数
     *  skip(Number): 忽略数据的条数
     */
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;

    User.count().then(function(count) {
        // 计算总页数
        pages = Math.ceil(count/limit);
        // 取值不能超过pages
        page = Math.min(page,pages);
        // 取值不能小于1
        page = Math.max(page,1);

        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function(users) {
            res.render('admin/user_index',{
                userInfo: req.userInfo,
                users: users,

                page: page,
                count: count,
                pages:pages,
                limit: limit
            });
        });
    });

});

// 分类管理
router.get('/category',function( req , res ) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Category.count().then(function(count) {
        // 计算总页数
        pages = Math.ceil(count/limit);
        // 取值不能超过pages
        page = Math.min(page,pages);
        // 取值不能小于1
        page = Math.max(page,1);

        var skip = (page - 1) * limit;

        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories) {
            res.render('admin/category_index',{
                userInfo: req.userInfo,
                categories: categories,

                page: page,
                count: count,
                pages:pages,
                limit: limit
            });
        });
    });
});

// 分类添加
router.get('/category/add',function( req , res ) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

// 分类的保存
router.post('/category/add',function(req,res) {
    var name = req.body.name || '';
    if(name == '') {
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '分类名称不能为空'
        });
        return;
    }
    Category.findOne({
        name: name
    }).then(function(rs) {
        // 数据库中存在同名分类
        if(rs) {
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '该分类已存在！'
            })
            return Promise.reject();
        }
        // 数据库中不存在同名分类，可以保存
        else {
            return new Category({name:name}).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '分类创建成功',
            url: '/admin/category'
        })
    })
});

// 分类修改
router.get('/category/edit',function(req,res) {
    // 获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    // 获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category) {
            res.render('admin/error',{
                userInfo: req.userInfo,
                message:'分类信息不存在'
            });
        }
        else {
            res.render('admin/category_edit',{
                userInfo: req.userInfo,
                category: category
            });
        }
    })

});

// 分类修改保存
router.post('/category/edit',function(req,res) {
    // 获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    // 获取post提交过来的名称
    var name = req.body.name || '';

    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category) {
            res.render('admin/error',{
                userInfo: req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }
        else {
            // 如果没有修改就提交
            if(name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            }
            else {
                // 要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    _id: {$ne: id}, // id不为这个
                    name: name
                })
            }
        }
    }).then(function(same) {
        if(same) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已有同名分类存在!'
            });
            return Promise.reject();
        }
        else {
            return Category.update({
                _id: id
            },{
                name: name
            })
        }
    }).then(function() {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '修改成功！',
            url: '/admin/category'
        })
    })
});

// 分类删除
router.get('/category/delete',function(req,res) {
    var id = req.query.id || '';
    Category.remove({
        _id: id
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '删除成功!',
            url: '/admin/category'
        })
    })
});

// 内容首页
router.get('/content',function(req,res) {
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Content.count().then(function(count) {
        // 计算总页数
        pages = Math.ceil(count/limit);
        // 取值不能超过pages
        page = Math.min(page,pages);
        // 取值不能小于1
        page = Math.max(page,1);

        var skip = (page - 1) * limit;

        Content.find().sort({addTime: -1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents) {
            // console.log(contents);
            res.render('admin/content_index',{
                userInfo: req.userInfo,
                contents: contents,

                page: page,
                count: count,
                pages:pages,
                limit: limit
            });
        });
    });
});

// 内容添加页面
router.get('/content/add',function( req,res) {
    Category.find().sort({_id: -1}).then(function(categories) {
        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categories: categories
        })
    });
});

// 内容保存
router.post('/content/add',function(req,res) {

    if(req.body.category == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '内容分类不能为空！'
        })
        return;
    }
    if(req.body.title == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '内容标题不能为空！'
        })
        return;
    }
    // 保存数据到数据库
    return new Content({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        user: req.userInfo._id.toString()
    }).save().then(function() {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    });
});

// 内容修改
router.get('/content/edit',function(req,res) {
    var id = req.query.id || '';

    var categories = [];

    Category.find().sort({_id: -1}).then(function(rs) {
        categories = rs;

        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function(content) {
        if(!content) {
            res.render('admin/error',{
                userInfo:req.userInfo,
                message: '指定内容不存在'
            });
            return Promise.reject();
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                categories: categories,
                content: content
            })
        }
    });
});

// 保存修改内容
router.post('/content/edit',function(req,res) {
    var id = req.query.id || '';

    if(req.body.category == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '内容分类不能为空！'
        })
        return;
    }
    if(req.body.title == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '内容标题不能为空！'
        })
        return;
    }

    Content.update({
        _id: id
    },{
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function() {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容修改成功',
            url: '/admin/content'
        })
    });
})

// 内容删除
router.get('/content/delete',function(req,res) {
    var id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(function() {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message:'删除成功！',
            url: '/admin/content'
        })
    })
})

module.exports = router;