var router = require('express').Router();


router.get('/search', (req, res) => {

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


module.exports = router; 
