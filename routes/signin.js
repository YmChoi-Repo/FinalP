const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const session = require('express-session');

const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'admin',
  password : 'abcd1234',
  database : 'final'
});

/* GET home page. */
app.get('/',(req, res) => {
  res.render('signin')
})

app.post('/',(req,res)=>{
 const id = req.body.id;
 const pw = req.body.pw;
 connection.query('select * from user where id=? and pw=?', [id, pw] ,(err,data)=>{
  if(!data[0]){ //오류
    console.log('로그인 실패')
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<script>alert("ID/PW 확인")</script>');
    res.write('<script>window.location="/signin"</script>');
    res.end();
  }else{
      req.session.userid = data[0].id;
      req.session.name = data[0].name;
      req.session.user_no = data[0].user_no;
      req.session.is_logined = true;
      req.session.save(function(){
        res.render('index',{
            id : id,
            name : req.session.name,
            is_logined : true
          });
      });
      console.log(req.session.name);
      console.log(req.session.id);
      console.log(req.session.userid);
      console.log(req.session.user_no);
      console.log(req.session)
    }
  })
});

module.exports = app;
