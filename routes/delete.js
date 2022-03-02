var router = require('express').Router();

//할거: 본인이 작성한 게시물만 삭제버튼 보이게 하기
router.delete('/delete', function(req, res){
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

module.exports = router;