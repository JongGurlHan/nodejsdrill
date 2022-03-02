var router = require('express').Router();

router.get('/edit/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, rst){
        if(rst == null){
            console.log("존재하지 않는 게시물입니다.");
            res.send("<script>alert('존재하지 않는 게시물입니다.');location.href='/list'</script>");
        }else{
        console.log(rst)
        res.render('edit.ejs', {post : rst});
        }
    })
})

router.put('/edit', function(req, res){
    db.collection('post').updateOne({_id : parseInt(req.body.id)}, {$set: {제목:req.body.title, 날짜: req.body.date}}, function(err, rst){
        console.log('수정완료')
        res.redirect('/list')
    })
    
})

module.exports = router;