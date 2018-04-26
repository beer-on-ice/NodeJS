var express = require('express');

// 加载模板处理模块
var swig = require('swig');

// 加载数据库模块
var mongoose = require('mongoose');

// 加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser');

// 加载cookies模块
var Cookies = require('cookies');

// 创建app应用 等同于 NodeJS Http.createServer();
var app = express();


app.use( bodyParser.urlencoded({extended : true}) );

// 设置cookie
// app.use(function(req,res,next) {
//     req.cookies = new Cookies(req,res);
//
//     req.userInfo = {};
//     if(req.cookies.get('userInfo')) {
//         try{
//             req.userInfo = JSON.parse(req.cookies.get('userInfo'));
//             next();
//         } catch(e){
//             next();
//         }
//     } else {
//         next();
//     }
// });

/**
 * 根据不同的功能划分模块
 */
app.use('/api', require('./routers/api'));


mongoose.connect('mongodb://localhost:27018/login',function(err) {
    if(err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        app.listen(8083);
    }
});
