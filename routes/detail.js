var router = require('express').Router();


router.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, rst){
        if(rst == null){
            console.log("존재하지 않는 게시물입니다.");
            res.send("<script>alert('존재하지 않는 게시물입니다.');location.href='/list'</script>");
        }else{
            console.log(rst);
            res.render('detail.ejs',{ detail : rst});
        }
    })

})



module.exports = router; 
