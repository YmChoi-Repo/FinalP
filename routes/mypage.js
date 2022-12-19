const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'admin',
  password : 'abcd1234',
  database : 'final'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.session.is_logined){
    res.redirect('signin');
  }else{
  res.render('mypage', { title: 'Express' });
  }
});

router.post('/userup', (req, res)=>{
  const name = req.body.name;
  const pw = req.body.pw;
  const id = req.session.userid;
  connection.query('update user set name=?, pw=? where id=?', [name ,pw, id], (err,data)=>{
    if(err){
      console.log(err)
    }else{
      console.log('수정에 성공했습니다.')
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.write('<script>alert("회원수정 되었습니다.")</script>');
      res.write('<script>window.location="/signin"</script>');
      res.end();
    }
  })
})


module.exports = router;
