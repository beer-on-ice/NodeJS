////////////////    入口文件      ////////////////////
let express = require('express')
let mongoose = require('mongoose')
// 解析post请求
let bodyParser = require('body-parser')
// express-session中间件将会话数据存储在服务器上
let session = require('express-session')
// connect-mongo用于将session持久化到mongodb数据库
let mongoStore = require('connect-mongo')(session)
// cookieParser 对http传入的cookie进行解析
let cookieParser = require('cookie-parser')
// 日志组件
let morgan = require('morgan')
let dbUrl = 'mongodb://localhost:27017/movie'
let port = process.env.PORT || 3000
let app = express()

// 贯穿整个生命周期 moment.js-处理时间
app.locals.moment = require('moment')

// post请求解析
app.use( bodyParser.urlencoded({extended : true}) )
// 静态文件指向
app.use('/public',express.static(__dirname + '/public'))

// 模板引擎配置设置
app.set('views', './views')
app.set('view engine','pug')

app.use(cookieParser())
app.use(session({
    secret: 'movie', // 一个String类型的字符串，作为服务器端生成session的签名
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}))

// 设置全局对象字面量，给模版用的
app.use((req,res,next)=>{
    let _user = req.session.user
    res.locals.user = _user;
    next()
})

if('development' === app.get('env')) {
    // 开发环境
    app.set('showStackError', true)
    app.use(morgan(':method :url :status'))
    app.locals.pretty = true
    mongoose.set('debug',true)
}

// 路由
require('./config/routes')(app)

// 连接数据库
mongoose.connect(dbUrl,function(err) {
    if(err) {console.log(err)}
    else {
        console.log('数据库连接成功');
        app.listen(port,()=>{
            console.log('server start on port ' + port);
        });
    }
})
