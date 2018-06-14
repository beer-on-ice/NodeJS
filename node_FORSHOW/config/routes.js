module.exports = function(app){
    // 路由
    app.use('/',require('./../routers/index'))
    app.use('/admin',require('./../routers/admin'))
    app.use('/movie',require('./../routers/movie'))
    app.use('/user',require('./../routers/user'))
}
