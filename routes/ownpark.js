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
    const user_no = req.session.user_no;
    connection.query('select own_park_content.name, own_park_content.basic_fee, own_park_content.basic_time, own_park_content.address, own_park_content.no from user join own_park_content on own_park_content.user_no = user.user_no where user.user_no=?', [user_no], (err,data)=>{
      if(err){
        console.log(err);
        throw err;
      }else{
        var template = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link rel="stylesheet" href="stylesheets/ownparktable.css">
            <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,700' rel='stylesheet' type='text/css'>
 	         <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
            <link rel="stylesheet" href="stylesheets/ownparkpage.css">
            <link rel="stylesheet" href="stylesheets/button.css">
            <link rel="stylesheet" href="stylesheets/checkbox.css">
            <link rel="stylesheet" href="stylesheets/ownparkbutton.css">
        </head>
        <body>
        <a href="/"><img src="images/parkinglogo.png" width="300" height="300"></a>
           <center>
             <img src="images/ownparklogo.png" width="300" height="300" style="margin-top: -250px">
           </center>
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
                        <th><div class="checkbox-group">
                        <input type="checkbox" id="custom-checkbox" class="custom-checkbox">
                        <span class="custom-checkbox-span" tabindex="0"></span>
                         </div></th>
                        <th>No.        </th>
                        <th>주차장명   </th>
                        <th>기본요금   </th>
                        <th>시간       </th>
                        <th>주소 </th>
                      </tr>
                    </thead>
                    `;
                   for(var i = 0; i < data.length; i++){
                    template += `
                    <tr>
                    <th><div class="checkbox-group">
                    <input type="checkbox" id="custom-checkbox" class="custom-checkbox">
                    <span class="custom-checkbox-span" tabindex="0"></span>
                     </div></th>
                      <th scope="row">${i + 1}</th>
                      <td>${data[i]['name']}</td>
                      <td>${data[i]['basic_fee']}</td>
                      <td>${data[i]['basic_time']}</td>
                      <td>${data[i]['address']}</td>
                      <th>
                        <form method='post' action='/ownpark/delete'>
                          <button type="submit" name='delname' value=${data[i]['no']} class='tablebtn'>삭제</button>
                        </form>
                      </th>
                      <th>
                        <button type='button' class='tablebtn' onclick="location.href='/ownparkupdate'">수정</button>
                      </th>
                    `;
                  }
                  template +=`
                    </table>
                  </div>
               </div>
           </div>
           <center>
             <a href="/ownparkinsert" class="btn btn-1">추가</a>
           </center>
         </body>
        </html>
           `;
           res.send(template);
        console.log(user_no);
        console.log('리스트불러오기 성공');
        console.log(data);
        // res.send(data);
      }
    })
  }
});

router.post('/delete', (req,res)=>{
    const no = req.body.delname;
    const user_no = req.session.user_no;

    connection.query(`delete from own_park_content where no=${no} and user_no=${user_no}`, (err,data)=>{
    if(err){
      console.log(err);
    }else{
      console.log('delete success');
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.write('<script>alert("삭제되었습니다.")</script>');
      res.write('<script>window.location="/ownpark"</script>');
      res.end();
    }
  })
})

module.exports = router;
