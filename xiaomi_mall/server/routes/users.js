var express = require('express');
var router = express.Router();
var Users = require('./../models/users');

var responseData;

router.use((req, res, next) => {
  responseData = {
    status: "0",
    msg: ''
  };
  next();
})
// 登录
router.post('/login', function(req, res, next) {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  if(param.userName == '' || param.userPwd == '') {
      responseData.status = "1";
      responseData.msg = "账号或密码不能为空！";
      res.json(responseData);
      return;
  }
  Users.findOne(param).then((doc) => {
      if(!doc) {
          responseData.status = "2";
          responseData.msg = "账号或密码错误！"
          res.json(responseData);
          return;
      }
      else{
          res.cookie("userId",doc.userId,{
              path:'/',
              maxAge: 1000*60*60
          });
          res.cookie("userName",doc.userName,{
              path:'/',
              maxAge: 1000*60*60
          });
          responseData.status = "0";
          responseData.msg = "";
          responseData.result = {
              nickName: doc.userName
          };
          res.json(responseData);
      }
  });
});

// 登出
router.get('/logout',(req,res,next)=>{
    res.cookie("userId","",{
        path: '/',
        maxAge: -1
    });
    responseData.status = "0";
    responseData.msg = "";
    responseData.result = "";
    res.json(responseData);
});

// 是否已登陆（缓存）
router.get('/checkLogin',function(req,res,next) {
    if(req.cookies.userId) {
        responseData.status = "0";
        responseData.msg = "";
        responseData.result = req.cookies;
        res.json(responseData);
    } else {
        responseData.status = "1";
        responseData.msg = "未登录";
        responseData.result = "";
        res.json(responseData);
    }
});

// 购物车列表
router.get('/cartList',(req,res,next)=> {
    let userId = req.cookies.userId;
    Users.findOne({userId: userId}).then((doc)=>{
        if(!doc) {
            responseData.status = "1";
            responseData.msg = "查无此人";
            responseData.result = "";
            res.json(responseData);
            return;
        }
        else {
            responseData.status = "0";
            responseData.msg = "";
            responseData.result = doc.cartList;
            res.json(responseData);
            return;
        }
    })
});

// 购物车删除
router.post('/cart/del',(req,res,next)=>{
    let userId = req.cookies.userId;
    let productId = req.body.productId;
    /* 方法一：  */
    // Users.findOne({userId:userId}).then((doc)=>{
    //     doc.cartList = doc.cartList.filter((item)=>{
    //         return item.productId !== productId
    //     })
    //     doc.save().then(()=>{
    //         responseData.status = 0;
    //         responseData.msg = '';
    //         responseData.result = 'success'
    //         res.json(responseData);
    //     });
    // })

    /* 方法二：  */
    Users.update({
        userId:userId
    },{
        $pull:{
            "cartList":{
                'productId':productId
            }
        }
    }).then((doc)=>{
        responseData.status = "0";
        responseData.msg = "删除成功";
        responseData.result = "";
        res.json(responseData);
    });
});

// 修改商品数量
router.post('/cart/edit',(req,res,next)=>{
    let userId = req.cookies.userId;
    let productId = req.body.productId;
    let productNum = req.body.productNum;
    let checked = req.body.checked;
    Users.update({
        "userId":userId,
        "cartList.productId": productId
    },{
        "cartList.$.productNum":productNum,
        "cartList.$.checked": checked
    }).then((doc)=>{
        responseData.status = "0";
        responseData.msg = "";
        responseData.result = "";
        res.json(responseData);
    });
});

router.post('/cart/editCheckAll',(req,res,next)=>{
    let userId = req.cookies.userId;
    let checkAll = req.body.checkAll;
    Users.findOne({userId:userId}).then((doc)=>{
        doc.cartList .forEach((item)=>{
            item.checked = checkAll;
        });
        doc.save().then((doc)=>{
            responseData.status = "0";
            responseData.msg = "";
            responseData.result = "";
            res.json(responseData);
        })
    })
});

module.exports = router;
