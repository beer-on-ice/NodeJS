var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    account: String,
    password: String
})
