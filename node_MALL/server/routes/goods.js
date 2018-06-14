let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('../models/goods');
let Users = require('../models/users');

var responseData;

router.use(function(req, res, next) {
    //路由，类似于java中的拦截器功能，在请求到达后台之前，先在这里处理。
    responseData = {
        status: 0,
        msg: ''
    }
    next(); //next的作用是将请求转发，这个必须有，如果没有，请求到这就挂起了。
})

//  首页商品列表
router.get('/list', function(req, res, next) {
    // 排序
    let sorts = Number(req.query.sorts || 1);
    let page = Number(req.query.page || 1);
    let pageSize = Number(req.query.pageSize || 5);
    let priceLevel = req.query.priceLevel;
    let skip = (page - 1) * pageSize;
    let priceGt = '';
    let priceLt = '';
    let param = {};

    if(priceLevel !== 'all') {
        switch(priceLevel) {
            case '0': priceGt = 0; priceLt = 100;break;
            case '1': priceGt = 100; priceLt = 500;break;
            case '2': priceGt = 500; priceLt = 1500;break;
            case '3': priceGt = 1500; priceLt = 3000;break;
            case '4': priceGt = 3000; priceLt = 4500;break;
        }
        param = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLt
            }
        }
    }
    let goodsModel = Goods.find(param).limit(pageSize).skip(skip).sort({'salePrice': sorts});

    goodsModel.exec().then(function(doc) {
        responseData.status = 0;
        responseData.msg = '';
        responseData.result = {'count': doc.length,'list': doc}
        res.json(responseData)
    })
});

// 加入购物车
router.post('/addCart',function(req,res,next) {
    let userId = '003';
    let productId = req.body.productId;
    // 找到用户
    Users.findOne({userId: userId}).then(function(userDoc) {
        if(userDoc) {
            let goodsItem = '';
            userDoc.cartList.forEach(function(item) {
                if(item.productId == productId) {
                    goodsItem = item;
                    item.productNum ++;
                }
            });
            if(goodsItem) {
                userDoc.save().then((doc2)=> {
                    responseData.status = 0;
                    responseData.msg = '';
                    responseData.result = 'success'
                    res.json(responseData);
                })
            }
            else {
                Goods.findOne({productId: productId}).then((productDoc)=> {
                if(productDoc) {
                    productDoc.productNum = "1";
                    productDoc.checked = "1";
                    userDoc.cartList.push(productDoc);
                    userDoc.save().then((doc2)=> {
                        responseData.status = 0;
                        responseData.msg = '';
                        responseData.result = 'success'
                        res.json(responseData);
                    })
                }
            });
            }
            // 找到点击的商品
        }
    })
});

module.exports = router;
