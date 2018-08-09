const mongoose = require('mongoose')
const {resolve} = require('path')
const db = 'mongodb://localhost:27017/forshow'
mongoose.Promise = global.Promise
const glob = require('glob')
// 初始化数据结构，引入所有schema
exports.initSchemas = () => {
  // 同步 获取指定文件夹下（./schema/）的文件（全部.js文件）
  glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}

// 初始化一个管理员
exports.initAdmin = async () => {
  const User = mongoose.model('User')
  let user = await User.findOne({
    username: 'Lijin'
  })

  if (!user) {
    const user = new User({
      username: 'Lijin',
      email: '997477295@qq.com',
      password: '123abc',
      role: 'admin'
    })

    await user.save()
  }
}

// 连接数据库
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
