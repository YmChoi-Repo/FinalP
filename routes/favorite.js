const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');


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

var Park = mongoose.model('Park', ParkingSchema);


/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.session.is_logined){
    res.redirect('signin');
  }else{
    const user = req.session.user_no;
    const uname = req.session.name;

    Park.find({},{_id : 0},function(err,data){
    // connection.query('select name, address, no from favor_park_seoul where user_no=?', [user_no], (err,data)=>{
      console.log(data)
      var template = `
      <html>
       <head>
            <title>Result</title>
            <meta charset="utf-8">
            <link rel="stylesheet" href="stylesheets/table.css">
            <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,700' rel='stylesheet' type='text/css'>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
            <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            <link rel="stylesheet" href="stylesheets/button.css">
            <link rel="stylesheet" href="stylesheets/ownparkbutton.css">
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
         <h2 class="heading-section">공유 주차장</h2>
         <section class="ftco-section">
       <div class="container">
             <div class="row justify-content-center">
               <div class="col-md-6 text-center mb-5">
               </div>
             </div>
            <div class="row">
               <div class="col-md-12">
                 <table class="table table-bordered table-dark table-hover">
                   <thead>
                     <tr>
                       <th>No.        </th>
                       <th>주차장명   </th>
                       <th>주차장 주소</th>
                       <th>글쓴이 </th>
                     </tr>
                   </thead>
                   `;
                   for(var i = 0; i < data.length; i++) {
                     template += `
                     <div class="popup">
                       <div class="popup-content">
                         <div class="parkingnum">
                             주차구획수 : ${data[i]['num']}대
                         </div>
                         <div class="parkingopday">
                             운영요일   : ${data[i]['opday']}
                         </div>
                         <div class="standardtime">
                             기본시간   : ${data[i]['bpt']}분
                         </div>
                         <div class="standardcharge">
                             기본요금   : ${data[i]['bpf']}원
                         </div>
                         <div class="monthcharge">
                             월 요금    : ${data[i]['mpf']}원
                         </div>
                         <div class="head">
                           <div class="btn-close" onclick="closepopup();"></div>
                         </div>
                             <div class="body">
                               <tbody>
                                 <tr>
                                 <th scope="row">${i + 1}</th>
                                 <th style="cursor:pointer;" onclick="openpopup(${i});">${data[i]['name']}</th>
                                 <th>${data[i]['dong']}</th>
                                 <th>${data[i]['uname']}</th>
                                 <th>
                                 <form method='post' action='/favorite/delete'>
                                   <button type="submit" name='delname' value=${data[i]['name']} class='tablebtn'>삭제</button>
                                 </form>
                                 </th>
                                 </tr>
                               </tbody>
                       </div>
                     </div>
                     `;
                   }
                   template += `
                 </table>
               </div>
            </div>
       </div>
         </section>
         <center>
           <a href="/favoriteinsert" class="btn btn-1">추가</a>
         </center>
              </body>
            </html>
            `;
            res.send(template);
          })
        }
  });

router.post('/delete', (req,res)=>{
    const name = req.body.delname;
    const user = req.session.user_no
    var park = Park.find({'name':name}, {'user':user});

    park.remove(function(err){
      if(err){
        console.log(err);
        return;
      }else{
        console.log('success');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write('<script>alert("삭제되었습니다.")</script>');
        res.write('<script>window.location="/favorite"</script>');
        res.end();
      }
    })
})

module.exports = router;
