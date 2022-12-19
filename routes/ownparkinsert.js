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
       </head>
       <body>
           <br>
           <br>
           <form action="/ownparkinsert/insert" method="post">
             <div class="form">
                 <input type="text" name="name" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="name" class="form__label">주차장 이름</label>
             </div>
             <br>
             <div class="form">
                 <input type="text" name="address" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="address" class="form__label">주차장 주소</label>
             </div>
             <br>
             <div class="form">
                 <input type="text" name="dong" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="dong" class="form__label">동</label>
             </div>
             <br>
             <div class="form">
                 <input type="text" name="basic_time" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="basic_time" class="form__label">기본시간</label>
             </div>
             <br>
             <div class="form">
                 <input type="text" name="basic_fee" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="basic_fee" class="form__label">기본요금</label>
             </div>
             <br>
            <div class="buttons">
              <input type='submit' value='추가' class="btn btn-1">
            </div>
           </form>
        </body>
       </html>
          `;
          res.send(template);
        }
  });

router.post('/insert', (req,res)=>{
    const name = req.body.name;
    const address = req.body.address;
    const dong = req.body.dong;
    const basic_time = req.body.basic_time;
    const basic_fee = req.body.basic_fee;
    const user_no = req.session.user_no;

    connection.query('insert into own_park_content(name, address, dong, basic_time, basic_fee, user_no) values(?,?,?,?,?,?)', [name, address, dong, basic_time, basic_fee, user_no], (err,data)=>{
      if(err){
        console.log(err);
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write('<script>alert("추가에 실패하였습니다..")</script>');
        res.write('<script>window.location="/ownpark"</script>');
        res.end();
      }else{
        console.log('Insert success');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write('<script>alert("추가되었습니다.")</script>');
        res.write('<script>window.location="/ownpark"</script>');
        res.end();
      }
    });
  })

module.exports = router;
