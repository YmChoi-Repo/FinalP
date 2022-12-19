var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.session.is_logined){
    res.redirect('signin');
  }else{
    res.render('destination', { title: 'Express' });
  }
});

module.exports = router;
