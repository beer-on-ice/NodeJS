const mongoose = require('mongoose')
const db = 'mongodb://localhost:27017/forshow'
mongoose.Promise = global.Promise

exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    mongoose.connect(db)

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db) // 重连
      } else {
        throw new Error('数据库挂了，请修复')
      }
    })
    mongoose.connection.on('error', err => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db) // 重连
      } else {
        console.log(err)
        throw new Error('数据库挂了，请修复')
      }
    })
    mongoose.connection.once('open', () => {
      resolve()
      console.log('数据库连接成功')
    })
  })
}
