// 应用启动文件

// 加载express模块
var express = require('express');

// 创建app应用 等同于 NodeJS Http.createServer();
var app = express();

/**
 * 设置静态文件托管
 * 当访问的url以/public开始，那么直接返回对应的 __dirname + '/public'下的文件
 */
app.use('/public', express.static(__dirname + '/public'));

// 加载模板处理模块
var swig = require('swig');

// 开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});
/**
 * 配置应用模板
 * 定义当前应用所使用的模板引擎
 *  第一个参数： 模板引擎的名称，同时也是文件的
 *  第二个参数： 用于解析处理模板内容的方法
 */
app.engine('html', swig.renderFile);

/**
 * 设置模板文件存放的目录
 *  第一个参数必须为views
 *  第二个参数是目录
 */
app.set('views', './views');

/**
 * 注册所使用的模板引擎
 *  第一个参数必须是view engine
 *  第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
 */
app.set('view engine', 'html');

// 加载数据库模块
var mongoose = require('mongoose');

// 加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser');

// 加载cookies模块
var Cookies = require('cookies');

/**
 * 根据不同的功能划分模块
 */
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

mongoose.connect('mongodb://localhost:27018/Blog',function(err) {
    if(err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        app.listen('8080');
    }
});

// 用户发送http请求 -> url -> 解析路由 -> 找到匹配的规则 -> 执行指定的绑定的函数，返回对应内容至用户

// /public -> 静态 ->直接读取指定目录下的文件，返回给用户 -> 动态 -> 处理业务逻辑，加载模板，解析模板 -> 返回数据给用户
