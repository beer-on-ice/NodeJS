var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
    director: String,
    title:String,
    language: String,
    country: String,
    summary: String,
    flash:String,
    year:Number,
    poster: String,
    meta: {
        createAt: {
            type:Date,
            default: Date.now()
        },
        updateAt: {
            type:Date,
            default: Date.now()
        }
    }
})
// 每次在执行save之前执行回调
MovieSchema.pre('save',function() {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }
    next()
})
// 静态方法
MovieSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort('meta.updateAt').exec(cb)
    },
    findById(id,cb) {
        return this.find({_id: id}).exec(cb)
    }
}

module.exports = MovieSchema
