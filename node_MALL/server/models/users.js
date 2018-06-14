var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    "userId": String,
    "userName": String,
    "userPwd":String,
    "orderList": Array,
    "cartList": [
        {
            "productId": String,
            "productName": String,
            "salePrice":String,
            "productImage": String,
            "checked": String,
            "productNum":String
        }
    ],
    "addressList": [
        {
            "addressid" : String,
            "userName" : String,
            "streetName" : String,
            "postCode" : Number,
            "tel" : Number,
            "isDefault" : Boolean
        }
    ]
},{"collection": "user"});
// mongodb会给集合名默认加 ‘s’, 使用{collection:user}解决

module.exports = mongoose.model('User',userSchema);
