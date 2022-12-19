const express = require('express');
const app = express();
const router = express.Router();
const session = require('express-session');


/* GET home page. */
app.get('/', (req,res)=>{
  console.log('메인페이지')
  console.log(req.session);
  if(!req.session.is_logined){
    res.redirect('signin');
  }else{
    res.render('index',{
      is_logined : req.session.is_logined,
      id : req.session.id,
      name : req.session.name
    })
  }
})

module.exports = app;
