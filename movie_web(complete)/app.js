////////////////    入口文件      ////////////////////
var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Movie = require('./models/movie')

var port = process.env.PORT || 3000
var app = express()

app.use( bodyParser.urlencoded({extended : true}) )
app.use('/public',express.static(__dirname + '/public'))
// 模板引擎配置设置
app.set('views', './views')
app.set('view engine','pug')

app.locals.moment = require('moment')

app.use('/admin',require('./routers/admin'))
app.use('/movie',require('./routers/movie'))
app.use('/user',require('./routers/user'))
// index page
app.get('/',(req,res)=>{
    Movie.fetch(function(err,movies) {
        if(err) {console.log(err);}
        else {
            res.render('pages/index',{
                title: '电影网站首页',
                movies: movies
            })
        }
    })
})


mongoose.connect('mongodb://localhost:27017/movie',function(err) {
    if(err) {console.log(err)}
    else {
        console.log('数据库连接成功');
        app.listen(port,()=>{
            console.log('server start on port ' + port);
        });
    }
})
