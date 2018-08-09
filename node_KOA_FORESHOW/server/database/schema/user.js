const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10 // 定义加密密码计算强度
const MAX_LOGIN_ATTEMPTS = 5// 最大登录次数
const LOCK_TIME = 2 * 60 * 60 * 1000 // 锁定时间

const userSchema = new Schema({
  username: {
    unique: true,
    type: String,
    required: true
  },
  email: {
    unique: true,
    type: String,
    required: true
  },
  password: {
    unique: true,
    type: String,
    required: true
  },
  loginAttempts: {
    default: 0,
    type: Number,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  lockUntil: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

userSchema.pre('save', function (next) {
  // 如果没有涉及到密码
  if (!this.isModified('password')) return next()
  // 使用pre中间件在用户信息存储前进行密码加密
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, function (error, hash) {
      if (error) return next(error)
      this.password = hash
      next()
    })
  })
})

// virtual不会真正存到数据库 。。 是否仍被锁住
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.methods = {
  // 密码比较
  comparePassword: function (_password, password) {
    return new Promise(function (resolve, reject) {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },
  // 判断用户是否尝试登录超过限制次数从而锁定
  incLoginAttempts: function (user) {
    return new Promise(function (resolve, reject) {
      // 已被锁定且已到锁定结束时间
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          // $set指定一个键的值，如果不存在，就创建它
          $set: {
            loginAttempts: 1
          },
          // 删除一个键
          $unset: {
            lockUntil: 1
          }
        }, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      } else {
        let updates = {
          // $inc可以对文档的某个值为数字型（只能为满足要求的数字）的键进行增减的操作
          $inc: { // +1
            loginAttempts: 1
          }
        }
        // 如果到了最大尝试次数
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }
        this.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
  }
}

mongoose.model('User', userSchema)
