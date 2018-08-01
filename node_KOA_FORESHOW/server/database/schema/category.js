const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId, Mixed} = Schema.Types

const CategorySchmea = new Schema({
  name: {
    unique: true,
    type: String
  },
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }],
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
// 每次有变化时修改时间
CategorySchmea.pre('save', function (next) {
  if (this.isNew) {
    // 新建
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('Category', CategorySchmea)
