const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Db } = require('mongodb');
app.use(bodyParser.urlencoded({extended:true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');


MongoClient.connect('mongodb+srv://admin:3shan212406@cluster0.nuqju.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
, function(err, client){
    if(err) return console.log(err)
    db = client.db('todoapp');    

    app.listen(8070, function(){
        console.log('listening on 8070')
    });
})

app.get('/', function(req, res){
    res.sendFile(__dirname +'/index.html')
})

app.get('/write', function(req, res){
    res.sendFile(__dirname + '/write.html')
})

//게시글 추가
app.post('/add', function(req, res){
    res.send('전송완료');

    db.collection('counter').findOne({name :'게시물갯수'}, function(err, rst){
        //console.log(rst.totalPost)
        var totalPost = rst.totalPost;

        db.collection('post').insertOne({_id : totalPost + 1, 제목 :req.body.title, 날짜 : req.body.date}, function(err, rst){
            console.log('저장완료')
        });

        //operator { $set : {totalPost:바꿀값}} / { $set : {totalPost:기존값에 더해줄값}}
        db.collection('counter').updateOne({name :'게시물갯수'},{ $inc : {totalPost:1 }}, function(err, rst){
            if(err){return console.log(err)}
        });
    }); 
})

//게시글 조회
app.get('/list', function(req, res){

    db.collection('post').find().toArray(function(err, rst){
        console.log(rst)
        res.render('list.ejs', {posts : rst});
    });
})

app.delete('/delete', function(req, res){
    //요청.body에 담겨온 게시물 번호를 가진 글을 db에서 찾아서 삭제해주세요
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, function(err, rst){
        console.log('삭제완료');
        // res.status(400).send({message: '실패했습니다.'});
        res.status(200).send({message: '성공했습니다.'});
    })
})

//디테일 페이지 조회
app.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, rst){
        console.log(rst);
        res.render('detail.ejs',{ detail : rst});
    })

})