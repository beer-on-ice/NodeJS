let sha1 = require('sha1')
let axios = require('axios')

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
                Promise.resolve(data)
            } else {
                return that.updateAccessToken()
            }
        })
        .then(function(data) {
            console.log(data)
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

module.exports = function (opts) {
    let wechat = new Wechat(opts)
    
    return function *(next) {
        let token = opts.token
        let signature = this.query.signature
        let nonce = this.query.nonce
        let timestamp = this.query.timestamp
        let echostr = this.query.echostr
        let str = [token, timestamp, nonce].sort().join('')
        let sha = sha1(str)

        if (sha === signature) {
            this.body = echostr + ''
        } else {
            this.body = 'wrong'
        }
    }
}