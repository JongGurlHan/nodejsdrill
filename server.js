
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Db } = require('mongodb');
app.use(bodyParser.urlencoded({extended:true}));
const MongoClient = require('mongodb').MongoClient;

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

require("dotenv").config();


app.set('view engine', 'ejs');
app.use('/public', express.static('public'));


MongoClient.connect(process.env.DB_URL, function(err, client){
    if(err) return console.log(err)
    db = client.db('todoapp');    

    app.listen(process.env.PORT, function(){
        console.log('listening on 8070')
    });
})

app.get('/', function(req, res){   
    res.render('index.ejs');
})

app.get('/write', function(req, res){
    // res.sendFile(__dirname + '/write.html')
    res.render('write.ejs');
})


//게시글 조회
app.get('/list', function(req, res){

    db.collection('post').find().toArray(function(err, rst){
        console.log(rst)
        res.render('list.ejs', {posts : rst}, );
    });
})

//특정 게시물 조회
app.get('/search', (req, res) => {

    var 검색조건 = [
        {
          $search: {
            index: 'titleSearch',
            text: {
              query: req.query.value,
              path: '제목'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
            }
          }
        }
        // {$sort : {_id : 1}} //결과정렬: _id순
      ] 
      



    db.collection('post').aggregate(검색조건).toArray((err, rst) =>{
        console.log(rst);
        res.render('search.ejs', {posts : rst})
    })
})


//디테일 페이지 조회
app.get('/detail/:id', function(req, res){
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

//게시물 수정
app.get('/edit/:id', function(req, res){
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

app.put('/edit', function(req, res){
    db.collection('post').updateOne({_id : parseInt(req.body.id)}, {$set: {제목:req.body.title, 날짜: req.body.date}}, function(err, rst){
        console.log('수정완료')
        res.redirect('/list')
    })
    
})


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/login', function(req, res){
    
    res.render('login.ejs')
});

//1. 누가 로그인하면 locall 방식으로 아이디, 비번 인증
app.post('/login', passport.authenticate('local', {
    failureRedirect : '/fail'
}), function(req, res){
    res.redirect('/')
});


app.get('/mypage', 로그인했니, function(req, res){
    console.log(req.user);    //deserializeUser해서 찾았던 db정보
    res.render('mypage.ejs', {user : req.user})
})


function 로그인했니(req, res, next){
    if(req.user){ //로그인 후 세션이 있으면 req.user가 항상있음
        next()
    }else{
        res.send('로그인 안하셨는데요?')
    }

}


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

app.get('/register', function(req, res){
    res.render('register.ejs')
})

//회원가입
app.post('/register', function (req, res) {
    //만약 가입하려는 아이디가 db에 있는 아이디와 같다면
    //alert으로 이미 존재하는 아이디입니다. 

    db.collection('login').findOne({id:req.body.id}, function(err, rst){
        var isId = rst.id
        if(isId){
            res.send(
                "<script>alert('이미 존재하는 아이디입니다.');location.href='/register'</script>");
            }else{
            db.collection('login').insertOne({ id: req.body.id, pw: req.body.pw }, function (err, rst) {
                res.redirect('/')
            })
        }
    })

   
    
  })

//게시글 추가
app.post('/add', function(req, res){
    res.send('전송완료');

    db.collection('counter').findOne({name :'게시물갯수'}, function(err, rst){
        //console.log(rst.totalPost)
        var totalPost = rst.totalPost;

        var 저장할거 = {_id : totalPost + 1, 제목 :req.body.title, 날짜 : req.body.date, 작성자 : req.user._id}

        db.collection('post').insertOne({저장할거}, function(err, rst){
            console.log('저장완료')
        });

        //operator { $set : {totalPost:바꿀값}} / { $set : {totalPost:기존값에 더해줄값}}
        db.collection('counter').updateOne({name :'게시물갯수'},{ $inc : {totalPost:1 }}, function(err, rst){
            if(err){return console.log(err)}
        });
    }); 
})
//할거: 본인이 작성한 게시물만 삭제버튼 보이게 하기
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

app.use('/board/sub', require('./routes/board.js')); // ./ :현재경로 (nodejs의 국룰)