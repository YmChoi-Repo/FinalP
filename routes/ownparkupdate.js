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

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.session.is_logined){
    res.redirect('signin');
  }else{
      var template = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
       <meta charset="UTF-8">
         <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>Document</title>
             <link rel="preconnect" href="https://fonts.gstatic.com">
             <link href="https://fonts.googleapis.com/css2?family=Convergence&family=Lato:wght@300;400;700;900&family=Mukta:wght@300;400;600;700;800&family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
             <link rel="stylesheet" href="stylesheets/mypark.css">
             <link rel="stylesheet" href="stylesheets/button.css">
             <link href="https://fonts.googleapis.com/css?family=Poppins:600" rel="stylesheet">
             <link rel="stylesheet" href="stylesheets/ownparkbutton.css">
      </head>
         <body>
         <br>
         <br>
         <form method='post' action='/ownparkupdate/update'>
         <div class="form">
           <input type="text" name="name" class="form__input" autocomplete="off" placeholder=" ">
             <label for="name" class="form__label">주차장 이름</label>
         </div>
         <br>
         <div class="form">
           <input type="text" name="basic_fee" class="form__input" autocomplete="off" placeholder=" ">
           <label for="basic_fee" class="form__label">기본요금</label>
         </div>
         <br>
         <div class="form">
           <input type="text" name="basic_time" class="form__input" autocomplete="off" placeholder=" ">
           <label for="basic_time" class="form__label">기본시간</label>
         </div>
         <br>
         <div class="buttons">
            <button type="submit" class='tablebtn' >수정</button>
         </div>
         </form>
        </body>
     </html>
      `;
      res.send(template);
  }
});

router.post('/update', (req,res)=>{
  const name = req.body.name;
  const basic_fee = req.body.basic_fee;
  const basic_time = req.body.basic_time;
  const user_no = req.session.user_no;

  connection.query(`select * from own_park_content where user_no=${user_no}`, (err,data)=>{
    if(err){
      console.log(err);
      throw err;
    }else{
      // console.log(data);
      const no = data[0].no;
      connection.query('update own_park_content set name=?, basic_fee=?, basic_time=? where no=?', [name, basic_fee, basic_time, no], (err,data)=>{
        if(err){
          console.log(err);
          throw err;
        }else{
          console.log('update success');
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          res.write('<script>alert("수정되었습니다.")</script>');
          res.write('<script>window.location="/ownpark"</script>');
          res.end();
        }
      })
    }
  })
})

module.exports = router;
