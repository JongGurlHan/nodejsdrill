var router = require('express').Router();

function 로그인했니(req, res, next){
    if(req.user){ //로그인 후 세션이 있으면 req.user가 항상있음
        next()
    }else{
        res.send("<script>alert('로그인해주세요!.');location.href='/login'</script>");
    }

}

router.get('/write', 로그인했니, function(req, res){    
    res.render('write.ejs' ,{loginUser : req.user.id});
})

router.post('/write', function(req, res){
    res.send('전송완료');

    db.collection('counter').findOne({name :'게시물갯수'}, function(err, rst){
        //console.log(rst.totalPost)
        var totalPost = rst.totalPost;


        db.collection('post').insertOne({_id : totalPost + 1, 제목 :req.body.title, 날짜 : req.body.date, 작성자 : req.user.id}, function(err, rst){
            console.log('저장완료')
        });

        //operator { $set : {totalPost:바꿀값}} / { $set : {totalPost:기존값에 더해줄값}}
        db.collection('counter').updateOne({name :'게시물갯수'},{ $inc : {totalPost:1 }}, function(err, rst){
            if(err){return console.log(err)}
        });
    }); 
})

module.exports = router;