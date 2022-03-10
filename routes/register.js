var router = require('express').Router();
const {body, validationResult} = require('express-validator')


router.get('/register', function(req, res){
    res.render('register.ejs')
})

//회원가입
//https://express-validator.github.io/docs/index.html
router.post('/register', 
    body('id').isLength({min:3}),

    (req, res) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    

      

    db.collection('login').findOne({id:req.body.id}, function(err, rst){
        console.log(rst); //db에서 찾은 계정정보
        //입력한 값         
        if(rst){ 
            if(rst.id == req.body.id){
                res.send(
                    "<script>alert('이미 존재하는 아이디입니다.');location.href='/register'</script>");   
            }
        }else{
            db.collection('login').insertOne({ id: req.body.id, pw: req.body.pw }, function (err, rst) {
                res.redirect('/')
            })            
         }            
    })   
    
  })

module.exports = router;