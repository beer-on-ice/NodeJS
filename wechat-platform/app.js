const Koa = require('koa')
let path = require('path')

let wechat = require('./wechat/P')
let util = require('./libs/util')

let wechat_file = path.join(__dirname,'./config/wechat.txt')

let config = {
    wechat: {
        appId: 'wx65c6e5af07a88786',
        appSecret: '01a5c36f2bec30dcedeead6fb0bc9ad5',
        token: 'lijinchaojidatiancaihaha',
        getAccessToken: function() {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken: function(data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_file,data)
        }
    }
}

let app = new Koa()

app.use(wechat(config.wechat))

app.listen(3000,function() {
    console.log('Listening： 3000');
})
