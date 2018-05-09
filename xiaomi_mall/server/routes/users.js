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

module.exports = router;
