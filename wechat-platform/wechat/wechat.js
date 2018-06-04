let axios = require('axios')
let util = require('./util')

let prefix = 'https://api.weixin.qq.com/cgi-bin/token'
let api = {
    accessToken: prefix + '?grant_type=client_credential'
}

function Wechat(opts) {
    let that = this
    
    this.appId = opts.appId
    this.appSecret = opts.appSecret
    
    // 获取access_token
    this.getAccessToken = opts.getAccessToken

    // 存储access_token
    this.saveAccessToken = opts.saveAccessToken
    
    this.getAccessToken()
        .then(function(data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
                // 更新access_token
                return that.updateAccessToken()
            }
            if (that.isValidAccessToken(data)) {
                return Promise.resolve(data)
            } else {
                return that.updateAccessToken()
            }
        })
        .then(function(data) {
            that.access_token = data.access_token
            that.expires_in = data.expires_in // 过期时间字段
            that.saveAccessToken(data)
        })
}

// 验证access_token
Wechat.prototype.isValidAccessToken = function(data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }
    let access_token = data.access_token
    let expires_in = data.expires_in
    let now = (new Date().getTime())

    if (now < expires_in) {
        // 尚未过期
        return true
    } else {
        return false
    }
}
// 更新票据
Wechat.prototype.updateAccessToken = function() {
    let appId = this.appId
    let appSecret = this.appSecret
    let url = api.accessToken

    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'GET',
            params: {
                appid: appId,
                secret: appSecret
            },
        }).then(response => {
            let data = response.data
            let now = (new Date().getTime())
            // 提前20秒刷新，考虑到网络因素
            let expires_in = now + (data.expires_in - 20) * 1000
            data.expires_in = expires_in

            resolve(data)
        }).catch(e => {
            console.info(e)
        })
    })
}

Wechat.prototype.reply = function() {
    let content = this.body
    let message = this.weixin

    let xml = util.tpl(content,message)

    this.status = 200
    this.type = 'application/xml'
    this.body = xml
}

module.exports = Wechat