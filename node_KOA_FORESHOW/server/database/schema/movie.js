const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId, Mixed} = Schema.Types

const movieSchmea = new Schema({
  doubanId: {
    unique: true,
    type: String
  },
  // 关联category表
  category: [{
    type: ObjectId,
    ref: 'Category'
  }],
  rate: Number,
  title: String,
  summary: String,
  video: String,
  poster: String,
  cover: String,

  videoKey: String,
  posterKey: String,
  coverKey: String,

  rawTitle: String,
  movieTypes: [String],
  pubdate: Mixed,
  year: Number,
  tags: [String],

  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

movieSchmea.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('Movie', movieSchmea)
