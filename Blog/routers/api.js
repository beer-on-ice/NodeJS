var express = require('express');
var router = express.Router();
var User = require('../models/User');

var responseData;

router.use(function(req,res,next) {
    //路由，类似于java中的拦截器功能，在请求到达后台之前，先在这里处理。
    responseData = {
        code: 0,
        message: ''
    }
    next();//next的作用是将请求转发，这个必须有，如果没有，请求到这就挂起了。
});


/**
 * 用户注册
 *  1.用户名不能为空
 *  2. 密码不能为空
 *  3. 两次输入的密码是否一致
 *  4. 用户是否已经被注册（数据库查询）
 */
router.post('/user/register',function(req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if(username == '') {
        responseData.code  = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if(password == '') {
        responseData.code  = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if(password !== repassword) {
        responseData.code  = 3;
        responseData.message = '两次输入密码不一致';
        res.json(responseData);
        return;
    }

    //用户名是否已经被注册了，如果数据库中已经存在和我们要注册的用户名同名的数据，表示该用户名已经被注册了
    User.findOne({
        username: username
    }).then(function( userInfo ) {
        if ( userInfo ) {
            console.log(userInfo);
            //表示数据库中有该记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }
        //保存用户注册的信息到数据库中
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo) {
        console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);
    });

});

module.exports = router;
