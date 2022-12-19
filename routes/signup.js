const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'admin',
  password : 'abcd1234',
  database : 'final'
});

router.get('/',(req, res) => {
  res.render('signup');
});

router.post('/', (req,res) => {
  var id = req.body.id;
  var pw = req.body.pw;
  var name = req.body.name;

  connection.query('select * from user where id="?"', [id], (err, data) => {
    console.log(data);
    if(err){
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.write('<script>alert("사용중인 ID")</script>');
      res.write('<script>window.location="/signup"</script>');
      res.end();
    } else{
      console.log('회원가입 성공');
      connection.query('insert into user(id, pw, name) values(?,?,?)', [id, pw, name]);
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.write('<script>alert("회원가입되었습니다.")</script>');
      res.write('<script>window.location="/signin"</script>');
      res.end();
    }
  })
})

module.exports = router;
