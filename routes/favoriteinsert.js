const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql');
const mongoose = require('mongoose');

const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'admin',
  password : 'abcd1234',
  database : 'final'
});

var ParkingSchema = mongoose.Schema({
  name:String, //주차장명
  dong:String, //동
  num: String, //주차대수
  opday:String, //운영요일
  bpt:String, //기본 주차 시간
  bpf:String, //기본 요금
  mpf:String, // 한달 주차 요금
  user:String,
  uname:String

},
  {
    collection : 'seoul'
});

var Parking = mongoose.model('Parking', ParkingSchema);

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
           <form action="/favoriteinsert/insert" method="post">
             <div class="form">
                 <input type="text" name="name" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="name" class="form__label">주차장 이름</label>
             </div>
             <br>
             <div class="form">
                 <input type="text" name="dong" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="dong" class="form__label">주차장 주소</label>
             </div>
             <br>
             <div class="form">
                 <input type="text" name="num" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="num" class="form__label">주차대수</label>
             </div>
             <br>
             <div class="form">
                 <input type="text" name="opday" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="opday" class="form__label">운영</label>
             </div>
             <br>
             <div class="form">
                 <input type="text" name="bpt" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="bpt" class="form__label">기본시간</label>
             </div>
             <br>
             <div class="form">
                 <input type="text" name="bpf" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="bpf" class="form__label">기본요금</label>
             </div>
             <br>
             <div class="form">
                 <input type="text" name="mpf" class="form__input" autocomplete="off" placeholder=" ">
                 <label for="mpf" class="form__label">월단위</label>
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
  const user_no = req.session.user_no;

  connection.query('select * from user where user_no=?',[user_no], (err,data)=>{
    console.log(data);
    if(err){
      console.log(err);
    }else{
      var name = req.body.name;
      var dong = req.body.dong;
      var num = req.body.num;
      var opday = req.body.opday;
      var bpt = req.body.bpt;
      var bpf = req.body.bpf;
      var mpf = req.body.mpf;
      var user = req.session.user_no;
      var uname = req.session.name;
      var park = new Parking({'name' : name, 'dong' : dong, 'num' : num, 'opday' : opday, 'bpt' : bpt, 'bpf' : bpf, 'mpf' : mpf, 'user':user, 'uname':uname});
      park.save(function(err,silence){
        if(err){
          console.log(err);
          res.status(500).send('update error');
          return;
        }else{
          console.log('success');
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          res.write('<script>alert("공유되었습니다!.")</script>');
          res.write('<script>window.location="/favorite"</script>');
          res.end();
        }
      })
    }
  })
})

module.exports = router;
