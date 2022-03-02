var router = require('express').Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

router.use(session({secret : '비밀코드', resave : true, saveUninitialized:false}));
router.use(passport.initialize());
router.use(passport.session());


router.get('/login', function(req, res){    
    res.render('login.ejs')
});

//1. 누가 로그인하면 local 방식으로 아이디, 비번 인증
router.post('/login', passport.authenticate('local', {
    failureRedirect : '/fail'
}), function(req, res){
    res.redirect('/')
});

//아이디 비번 인증
passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
}, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (err, rst) {
        if (err) return done(err)

        if (!rst) return done(null, false, { message: '존재하지않는 아이디요' })
        if (입력한비번 == rst.pw) {
            return done(null, rst)
        } else {
            return done(null, false, { message: '비번틀렸어요' })
        }
    })
}));

//로그인 성공 -> 세션정보를 만듦 -> 마이페이지 방문시 세션검사

//3. 인증성공하면 세션,쿠키 만들어줌
//세션을 저장시키는 코드(로그인 성공시 발동)
//위의 return done(null, rst)에서의 rst가 user로 들어간다 
passport.serializeUser(function(user, done){
    done(null, user.id) //id를 이용해서 세션을 저장시키는 코드(로그인 성공시 발동) 이후 세션데이터를 만들고 브라우저로 세션의 id정보를 쿠키로 보냄

});

//로그인한 유저의 개인정보를 db에서 찾는 역할, 이 세션 데이터를 가진 사람을 db에서 찾아주세요(마이페이지 접속시 발동)
//deserializeUser(): 로그인한 유저의 세션아이디를 바탕으로 개인정보를 DB에서 찾는 역할
passport.deserializeUser(function(아이디, done){
    //디비에서 user.id로 유저를 찾은 뒤에 유저 정보(id, pw, etc..)를 아래 null 다음에 넣음
    db.collection('login').findOne({id : 아이디}, function(err, rst){
        // console.log("아이디:" + 아이디);
        done(null, rst)

    })
});


module.exports = router; 
