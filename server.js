const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const MongoClient = require('mongodb').MongoClient;
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

app.post('/add', function(req, res){
    res.send('전송완료');
    console.log(req.body.title); 
    console.log(req.body.date); 

})
