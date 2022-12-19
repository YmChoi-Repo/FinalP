const createError = require('http-errors');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const HTTP_PORT = 443;
const HTTPS_PORT = 3000;
const options = {
  key : fs.readFileSync('./rootca.key'),
  cert : fs.readFileSync('./rootca.crt')
}
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const router = express.Router();
const static = require('serve-static');
const session = require('express-session');

app.use(session({
  secret : 'my key',
  resave : 'false',
  saveUninitialized : true,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.set('port', process.env.PORT || 3000)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var index = require('./routes/index');
app.use('/', index);
var signin = require('./routes/signin');
app.use('/signin', signin);
var signup = require('./routes/signup');
app.use('/signup', signup);
var nearbyparkinglot = require('./routes/nearbyparkinglot');
app.use('/nearbyparkinglot', nearbyparkinglot);
var destination = require('./routes/destination');
app.use('/destination', destination);
var map = require('./routes/map');
app.use('/map', map);
var ownpark = require('./routes/ownpark');
app.use('/ownpark', ownpark);
var ownparkinsert = require('./routes/ownparkinsert');
app.use('/ownparkinsert', ownparkinsert);
const logout = require('./routes/logout');
app.use('/logout', logout);
const favorite = require('./routes/favorite');
app.use('/favorite', favorite);
const mypage = require('./routes/mypage');
app.use('/mypage', mypage);
const ownparkupdate = require('./routes/ownparkupdate');
app.use('/ownparkupdate', ownparkupdate);
const favoriteinsert = require('./routes/favoriteinsert');
app.use('/favoriteinsert', favoriteinsert)
const tmap = require('./routes/tmap');
app.use('/tmap', tmap);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/finalproject');

https.createServer(options, app).listen(HTTPS_PORT);

app.listen(app.get('port'), () =>{
	console.log('3000 Port : 서버 실행 중')
});

module.exports = app;
