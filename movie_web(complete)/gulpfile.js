// 添加引用
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

//这个可以让express启动
gulp.task("node", function() {
    nodemon({
        script: './app.js',
        ignore: [
            'README.md', 'node_modules/**', '.DS_Store', 'mark.md',
            'gruntfile.js'
        ],
        env: {
            "NODE_ENV": "development"
        }
    })
});

gulp.task('server', ["node"], function() {
    var files = [
        'public/js/**',
        'models/**/*.js',
        'schemas/**/*.js',
        'router/**',
        'views/**'];

    //gulp.run(["node"]);
    browserSync.init(files, {
        proxy: 'http://localhost:3000',
        browser: 'chrome',
        notify: false,
        port: 3003
    });

    gulp.watch(files).on("change", reload);
});
