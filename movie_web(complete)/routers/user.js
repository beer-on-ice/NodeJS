var express = require('express')
var router = express.Router()
var User = require('../models/user')

// signup
router.post('/signup',(req,res)=>{
    var _user = req.body.user
    User.findOne({name: _user.name},(err,user)=>{
        if(err) {
            console.log(err);
        }
        if(user) {
            res.redirect('/admin/userlist')
        }
        else {
            var user = new User(_user)
            user.save((err,user)=> {
                if(err) {
                    console.log(err);
                }
                else{
                    res.redirect('/admin/userlist')
                }
            })
        }
    })

})

// signin
router.post('/signin',(req,res)=>{
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User.findOne({name:name}).then((user)=>{
        if(!user) {
            return res.redirect('/')
        }
        user.comparePassword(password,function(err,isMatch) {
            if(isMatch) {
                console.log('Password is right!');
                return res.redirect('/')
            }
            else {
                console.log('Password is Wrong!');
            }
        })
    })
})
module.exports = router;
