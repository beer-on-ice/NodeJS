let express = require('express');
let router = express.Router();
let User = require('../models/User');

let responseData;
router.use(function(req,res,next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
});

// 注册
router.post('/user/register', function(req, res) {
    let account = req.body.account;
    let password = req.body.password;
    let repassword = req.body.repassword;

    //用户是否为空
    if (account == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    //密码不能为空
    if (password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    //密码不能为空
    if (repassword !== password) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致！';
        res.json(responseData);
        return;
    }

    User.findOne({account: account}).then(function(userInfo) {
        if(userInfo) {
            //表示数据库中有该记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }
        //保存用户注册的信息到数据库中
        let user = new User({account: account, password: password});
        return user.save();
    }).then(function(newUserInfo) {
        responseData.message = '注册成功';
        res.json(responseData);
        return;
    });
})

// 登录
router.post('/user/login',function(req,res) {
    let account = req.body.account;
    let password = req.body.password;
    if(account == '' || password == '') {
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空！';
        res.json(responseData);
        return;
    }

    User.findOne({
        account:account,
        password: password
    }).then(function(userinfo) {
        if(!userinfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误！'
            res.json(responseData);
            return;
        }
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userinfo.id,
            account: userinfo.account
        }

        res.json(responseData);
        return;
    })
});

// 上传头像
router.post('/user/avatar',function(req,res) {
    
});

module.exports = router;
