class User {
  @checkLogin(true)
  getUserInfo() {
    console.log('查询到用户信息');
  }
  @checkLogin(false)
  senMess() {
    console.log('发送消息');
  }
}

function checkLogin(value) {
  return function(target,name,descriptor) {
    let method = descriptor.value
    console.log(method);
    
    let isLogin = value // 模拟是否已经登录

    descriptor.value = function(...args) {
      if(isLogin) {
        console.log('已登录，可以查询');
        method.apply(this,args)
      } else {
        console.log('没登陆，跳转到登录界面。。。');
      }
    }
  }
}
let u = new User()
u.getUserInfo()
u.senMess()