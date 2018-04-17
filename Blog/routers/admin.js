var express = require('express');
var router = express.Router();

router.get('/user',function(req,res,next) {
    res.send('Admin - user')
})

module.exports = router;
