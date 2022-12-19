const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.get('/',(req, res)=>{
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    }else{
      console.log(req.session);
      return res.redirect('/');
    }
  })
})

module.exports = app;
