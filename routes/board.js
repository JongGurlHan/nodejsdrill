var router = require('express').Router();


function 로그인했니(req, res, next){
    if(req.user){ //로그인 후 세션이 있으면 req.user가 항상있음
        next()
    }else{
        res.send('로그인 안하셨는데요?')
    }

}

router.use(로그인했니); //여기있는 모든 url에 적용할 미들웨어

//router.use('/sports', 로그인했니); //특정 url에만 적용

router.get('/sports', function(req, res){
    res.send('스포츠게시판');
})

router.get('/game', function(req, res){
    res.send('게임게시판');
})

module.exports = router; 
