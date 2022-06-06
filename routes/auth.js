const { name } = require('ejs');
var express = require('express');
var router = express.Router();
var connection = require('../models/database');


/* GET users listing. */
//display login page
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login', email: '', password: '' })
});

//authenticate user
router.post('/authentication', function (req, res, next) {
  var userID = req.body.userID;
  var password = req.body.password;

  connection.query('SELECT * FROM users WHERE userID =? AND password =?', [userID, password], function (err, rows, fields) {
    if (err) throw err;
    //if user not found
    if (rows.length <= 0) {
      req.flash('error', '아이디와 비밀번호를 정확히 입력해주세요');
      res.redirect('/auth/login');
    } else {//if user found
      // render to views/index.ejs template file
      req.session.loggedin = true;
      req.session.name = name;
      res.redirect('/auth');
    }
  });
});

//display login page
router.get('/register', function (req, res, next) {
  // render to views/register.ejs
  res.render('register', {
    title: 'Registration Page',
    name: '',
    email: '',
    password: ''
  });
});

// user registration
router.post('/post-register', function (req, res, next) {

  var userName = req.body.userName;
  var userID = req.body.userID;
  var password = req.body.password;
  var email = req.body.email;
  var address = req.body.address;
  var phoneNum = req.body.phoneNum;
  var datas = [userName, userID, password, email, address, phoneNum];

  connection.query("INSERT INTO users(userName, userID, password, email, address, phoneNum) values(?,?,?,?,?,?)", datas, function (err, result) {
    //if(err) throw err
    if (err) console.error("err : " + err)
    else {
      req.flash('success', '성공적으로 가입했습니다!');
      res.redirect('/auth/login');
    }
  });
});

//display home page
router.get('/', function (req, res, next) {
  if (req.session.loggedin) {
    res.render('index', {
      title: "O-car",
      name: req.session.name,
    });
  } else {
    req.flash('success', '먼저 로그인을 해주세요!');
    res.redirect('/auth/login');
  }
});

// Logout user
router.get('/logout', function (req, res) {
  req.session.destroy();
  req.flash('success', '여기에서 다시 로그인해 주세요!');
  res.redirect('/auth/login');
});
module.exports = router;
