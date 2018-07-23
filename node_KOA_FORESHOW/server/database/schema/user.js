const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10 // 加密强度
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

userSchema.pre('save', next => {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

userSchema.pre('save', next => {
  if (!this.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) return next(error)
      this.password = hash
      next()
    })
  })
})

// virtual不会真正存到数据库
// 锁定时间
userSchema.virtual('isLocked').get(() => {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.methods = {
  // 密码比较
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },
  // 判断用户是否尝试登录超过限制次数从而锁定
  incLoginAttempts: user => {
    return new Promise((resolve, reject) => {
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
