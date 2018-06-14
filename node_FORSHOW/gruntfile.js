module.exports = function(grunt) {
    // 定义任务
    grunt.initConfig({
        watch: {
            pug: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files:['public/js/**','models/**/*.js','schemas/**/*.js'],
                // tasks: ['jslint'],
                options: {
                    livereload: true
                }
            }
        },
        nodemon: {
            dev:{
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md','node_modules/**','.DS_Store'],
                    watchedExtensions:['js'],
                    watchedFolders: ['app','config'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon','watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    })
    //配置参数
    grunt.option('force',true)
    //加载插件
    //用来实时监听,并执行其他任务
    grunt.loadNpmTasks('grunt-contrib-watch')
    //用来实时监听,并重启服务器
    grunt.loadNpmTasks('grunt-nodemon')
    //并发执行多个任务,可以显著改善多个负责任务构建的耗时
    grunt.loadNpmTasks('grunt-concurrent')
    //注册默认任务
    grunt.registerTask('default',['concurrent'])
}
