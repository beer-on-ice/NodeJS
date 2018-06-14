let express = require('express')
let router = express.Router()
let User = require('../app/models/user')


// signup
router.get('/signup',(req,res)=>{
    res.render('pages/signup',{
        title: '注册页面'
    })
})
router.post('/signup',(req,res)=>{
    var _user = req.body.user
    User.findOne({name: _user.name},(err,user)=>{
        if(err) { console.log(err) }
        if(user) {
            res.redirect('/user/signin')
        }
        else {
            // 创建新用户
            var user = new User(_user)
            user.save((err,user)=> {
                if(err) {
                    console.log(err);
                }
                else{
                    res.redirect('/')
                }
            })
        }
    })

})

// signin
router.get('/signin',(req,res)=>{
    res.render('pages/signin',{
        title: '登录页面'
    })
})
router.post('/signin',(req,res)=>{
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User.findOne({name:name}).then((user)=>{
        if(!user) {return res.redirect('/user/signup')}
        // 实例方法校验密码
        user.comparePassword(password,function(err,isMatch) {
            if(isMatch) {
                // 设置服务器缓存
                req.session.user = user
                return res.redirect('/')
            }
            else {
                return res.redirect('/user/signin')
                console.log('Password is Wrong!');
            }
        })
    })
})

// logout
router.get('/logout',(req,res)=>{
    delete req.session.user // 删除session中user
    delete res.locals.user // 删除res中user
    res.redirect('/')
})


module.exports = router;
