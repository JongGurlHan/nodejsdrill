
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Db } = require('mongodb');
app.use(bodyParser.urlencoded({extended:true}));
const MongoClient = require('mongodb').MongoClient;

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const {check, validationResult} = require('express-validator')

require("dotenv").config();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));


//로그인 관련
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
//===========

MongoClient.connect(process.env.DB_URL, function(err, client){
    if(err) return console.log(err)
    db = client.db('todoapp');    

    app.listen(process.env.PORT, function(){
        console.log('listening on 8070')
    });
})

// ==메인 페이지 이동==
app.get('/', function(req, res){   
    res.render('index.ejs');
})

//== 게시물 검색==
app.use('/', require('./routes/search.js') );

//==상세 페이지 조회==
app.use('/', require('./routes/detail.js') );

//===게시물 수정===
app.use('/', require('./routes/edit.js') );

//===로그인===
app.use('/', require('./routes/login.js') );


function 로그인했니(req, res, next){
    if(req.user){ //로그인 후 세션이 있으면 req.user가 항상있음
        next()
    }else{
        res.send("<script>alert('로그인해주세요!.');location.href='/login'</script>");
    }

}

//== mypage 이동==
app.get('/mypage', 로그인했니, function(req, res){
    console.log(req.user);    //deserializeUser해서 찾았던 db정보
    res.render('mypage.ejs', {user : req.user})
})

//===게시글 조회===
app.use('/', require('./routes/list.js') );


//=== 회원가입 ===
app.use('/', require('./routes/register.js') );


//=== 글작성 ===
app.use('/', require('./routes/write.js') );

//=== 글삭제===
// app.use('/', require('./routes/delete.js') );

app.delete('/delete', function(req, res){
    //요청.body에 담겨온 게시물 번호를 가진 글을 db에서 찾아서 삭제해주세요
    console.log(req.body);
    req.body._id = parseInt(req.body._id);

    var 삭제할데이터 = {_id : req.body._id, 작성자 : req.user._id} //둘다 만족하는 게시물 찾아서 지워줌

    db.collection('post').deleteOne(삭제할데이터, function(err, rst){
        console.log('삭제완료');
        // res.status(400).send({message: '실패했습니다.'});
        if(rst){console.log(rst)}
        res.status(200).send({message: '성공했습니다.'});
    })
})