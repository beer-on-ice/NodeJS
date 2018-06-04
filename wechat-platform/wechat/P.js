let sha1 = require('sha1')
let getRawBody = require('raw-body')
let Wechat = require('./wechat')
let util = require('./util')

module.exports = function (opts) {
    // let wechat = new Wechat(opts)
    
    return function *(next) {
        let that = this
        let token = opts.token
        let signature = this.query.signature
        let nonce = this.query.nonce
        let timestamp = this.query.timestamp
        let echostr = this.query.echostr
        let str = [token, timestamp, nonce].sort().join('')
        let sha = sha1(str)
        
        if(this.method === 'GET') {
            if (sha === signature) {
                this.body = echostr + ''
            } else {
                this.body = 'wrong'
            }
        }
        else if (this.method === 'POST') {
            if (sha !== signature) {
                this.body = 'wrong'
                return false
            } 
            let data = yield getRawBody(this.req,{
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            })

            let content = yield util.parseXMLAsync(data)
            
            let message = util.formatMessage(content.xml)
            console.log(message);

            this.weixin = message
            
            yield handler.call(this,next)

            wechat.reply.call(this)

            // if(message.MsgType === 'event') {
            //         // 订阅事件
            //     if(message.Event === 'subscribe') {
            //         let now = new Date().getTime()
            //         that.status = 200
            //         that.type = 'application/xml'
                    
            //         let reply = xml
            //         that.body = reply

            //         return
            //     }
            // }
        }
    }
}