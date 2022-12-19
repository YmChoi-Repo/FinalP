const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
const CircularJSON = require('circular-json');
const request = require('request');
const mysql = require('mysql');
const session = require('express-session');

const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'admin',
  password : 'abcd1234',
  database : 'final'
});

var SeoulParkingSchema = mongoose.Schema({
  name:String, //주차장명
  address:String, // 주차장 주소
  dong:String,
  num: String, //주차구획수
  opday:String, //운영요일
  wds:String, //평일 시작
  wde:String, //평일 마감
  hds:String, //주말 시작
  hde:String, //주말 마감
  bpt:String, //기본 주차 시간
  bpf:String, //기본 요금
  mpf:String, // 한달 주차 요금
},
  {
    collection : 'seoul'
});

var SeoulParking = mongoose.model('SeoulParking', SeoulParkingSchema);

router.get('/', function(req, res, next) {
  SeoulParking.find({},{_id : 0, latitude : 0, longitude : 0},function(err,data){
    if(!req.session.is_logined){
      res.redirect('signin');
    }else{
//    console.log(docs[0].name);
    var template = `
<html>
  <head>
       <title>Result</title>
       <meta charset="utf-8">
       <link rel="stylesheet" href="stylesheets/table.css">
       <link rel="stylesheet" href="stylesheets/style.css">
       <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,700' rel='stylesheet' type='text/css'>
	     <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
       <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script>
    function openpopup(i) {
      $('.popup:eq('+i+')').css('opacity', '1');
      $('.popup:eq('+i+')').css('visibility', 'visible');
    }
    function closepopup() {
        $('.popup').css('opacity', '');
        $('.popup').css('visibility', '');
    }
  </script>
  </head>
    <body>
    <a href="/"><img src="images/parkinglogo.png" width="300" height="300"></a>
    <h2 class="heading-section">주변 주차장</h2>
    <section class="ftco-section">
  <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 text-center mb-5">
          </div>
        </div>
       <div class="row">
          <div class="col-md-12">
            <table class="table table-bordered table-dark table-hover">
              <section>
                    <form action="/map/maptest" method="get" target="targetURL">
                      <div class="box">
                      <div class="container-4">
                      </div>
                    </div>
                    </form>
                    <!-- ifame 태그에서, src(경로) 지정해줄 때, 완벽한 경로 /map/map.html로 지정하면 get으로 처리받을 수 없다 -->
                  </section>
              </div>
              <div class="nearbyparkinglot_mapzone">
                <iframe name=targetURL class="iframe-preview center" width="800" height="500" style="border:none;" src="/map/maptest" scrolling="no">
                </iframe>
              </div>
              `;
              template += `
            </table>
          </div>
       </div>
  </div>
    </section>
         </body>
       </html>
       `;
       res.send(template);
      //  res.render('seoulparkinglo', { title: 'Express' });
      }
    });
});

router.get('/insert', (req, res)=>{
  const name = req.query.name;

  SeoulParking.find({'name':name},{_id:0},function(err,data){
    console.log(data);
    if(err){
      throw err;
      console.log('여기가 에러');
    }else{
      const name = data[0].name;
      const address = data[0].address;
      const dong = data[0].dong;
      const num = data[0].num;
      const opday = data[0].opday;
      const wds = data[0].wds;
      const wde = data[0].wde;
      const hds = data[0].hds;
      const hde = data[0].hde;
      const bpt = data[0].bpt;
      const bpf = data[0].bpf;
      const mpf = data[0].mpf;
      const latitude = data[0].latitude;
      const longitude = data[0].longitude;
      const user_no = req.session.user_no;

      connection.query('select * from user join favor_park_seoul on favor_park_seoul.user_no = user.user_no where user.user_no =?', [user_no],(err,data)=>{
        if(err){
          throw err;
          console.log(err);
        }else{
          connection.query('insert into favor_park_seoul(name, address, dong, num, opday, wds, wde, hds, hde, bpt, bpf, mpf, latitude, longitude, user_no) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [name, address, dong, num, opday, wds, wde, hds, hde, bpt, bpf, mpf, latitude, longitude, user_no], (err,data)=>{
            if(err){
             throw err;
              console.log('저기가 에러')
            }else{
              console.log('success');
              res.render('favorite');
            }
          })
          connection.end();
        }
      })
      connection.end();
    }
  })
})


module.exports = router;
