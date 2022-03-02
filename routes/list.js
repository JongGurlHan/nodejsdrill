var router = require('express').Router();

router.get('/list', function(req, res){

    //로그인했다면
    if(req.user){
        db.collection('post').find().toArray(function(err, rst){
            console.log(rst)
            console.log("로그인함")
    
            res.render('list.ejs', {posts : rst, loginUser : req.user.id});
        });        
    }else{
        db.collection('post').find().toArray(function(err, rst){
            console.log(rst)
            console.log("로그인 안함")
    
            res.render('list.ejs', {posts : rst});
        });  

    }

})

module.exports = router;