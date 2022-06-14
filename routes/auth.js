var express = require('express');
var router = express.Router();
var connection = require('../models/database');
var multer = require('multer');
var path = require('path');
const PoolResource = require('nodemailer/lib/smtp-pool/pool-resource');

//Image loading
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext);
  },
})
var upload = multer({ storage: storage });

var user_name;
var user_id;

/* GET users listing. */
//display login page
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login', userID: '', password: '' })
});

//authenticate user
router.post('/authentication', function (req, res, next) {
  var userID = req.body.userID;
  var password = req.body.password;

  connection.query('SELECT * FROM user WHERE user_id =? AND user_pw =?', [userID, password], function (err, rows, fields) {
    if (err) throw err;
    //if user not found
    if (rows.length <= 0) {
      req.flash('error', '아이디와 비밀번호를 정확히 입력해주세요');
      res.redirect('/auth/login');
    } else {//if user found
      // render to views/index.ejs template file
      req.session.loggedin = true;
      user_name = rows[0].user_name;
      user_id = rows[0].user_id;
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
    userID: '',
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

  //회원가입 날짜
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  var DateTime = date + ' ' + time;

  var datas = { user_id: userID, user_name: userName, user_pw: password, user_phone: phoneNum, user_email: email, user_address: address, created_date: DateTime };
  connection.query('INSERT INTO user SET ?', datas, function (err, result) {
    //if(err) throw err
    if (err) {
      console.error("err : " + err);
      req.flash('error', '아이디가 이미 있었습니다!');
      res.redirect('/auth/register');
      return;
    }
    if (result) {
      req.flash('success', '성공적으로 가입했습니다!');
      res.redirect('/auth/login');
    } else {
      req.flash('error', '가입 실패했습니다!');
      res.redirect('/auth/register');
    }
  })

});

router.get('/forgot_pwd', function(req, res, next) {

  res.render('forgot_pwd', {title: '비밀번호 찾기'});

});

router.post('/post-pwd', function(req,res,next){
  var user_id = req.body.userID;
  var user_email = req.body.email;
  var sql = "SELECT * FROM user WHERE user_id = ?";
  var sql1 = "SELECT * FROM user WHERE user_email = ?";

  connection.query(sql,[user_id],function(err,row){
    connection.query(sql1,[user_email],function(err,row1){
      if (err) {
        console.log("err : ", err);
        req.flash('error', '아이디나 이메일이 잘못 입력되었습니다.');
      }

      res.redirect('/auth/forgot_pwd');
    });
    
  });
});

/* Get User Page*/
router.get('/detail/user/:user_name', function (req, res, next) {
  var name = req.params.user_name;
  var sql = "SELECT * FROM user WHERE user_name = ?";
  connection.query(sql, [name], function (err, rows) {
    if (err) console.error(err);
    console.log("조회 결과 확인 : ", rows);
    res.render('auth_detail', { title: "회원 정보", row: rows[0], name: name });
  });
});

/*GET Update information of user */
router.get('/update', function (req, res, next) {
  var user_id = req.query.user_id;
  var sql = "SELECT * FROM user WHERE user_id = ?";
  connection.query(sql, [user_id], function (err, rows) {
    if (err) console.log(err);
    res.render('auth_update', { title: "회원정보 수정", row: rows[0] });
  });
});

/*POST Update information of user */
router.post('/update', function (req, res, next) {
  var user_name = req.body.user_name;
  var user_email = req.body.user_email;
  var user_address = req.body.user_address;
  var user_phone = req.body.user_phone;
  var user_pw = req.body.user_pw;

  //업데이트 날짜
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  var DateTime = date + ' ' + time;

  var datas = [user_name, user_phone, user_email, user_address, DateTime, user_pw];

  var sql = "UPDATE user SET user_name=?, user_phone=?, user_email=?, user_address=?, created_date =? WHERE user_pw=?";

  connection.query(sql, datas, function (err, result) {
    if (err) console.log("회원정보 수정 에러 : ", err);
    if (result.affectedRows == 0) {
      res.send("<script>alert('패스워드가 일치하지 않거나, 잘못돤 요청으로 인해 변경되지 않았습니다.');history.back();</script>")
    } else {
      res.redirect('/auth/detail/user/' + user_name);
    }
  })
});

//판매 페이지
router.get('/sell', function (req, res, next) {
  if (req.session.loggedin) {
    res.render('sell', { title: "자동차 판매 등록", name: user_name, id: user_id });
  } else {
    req.flash('success', '먼저 로그인해 주세요!');
    res.redirect('/auth/login');
  }

});

//판매 페이지
router.post('/sell-post', upload.single('image'), function (req, res, next) {
  var seller_id = req.body.user_id;
  var car_number = req.body.car_number;
  var image = `/images/${req.file.filename}`;
  var car_title = req.body.car_title;
  var car_year = req.body.car_year;
  var car_mileage = req.body.car_mileage;
  var car_fuel = req.body.car_feul;
  var car_info = req.body.car_info;
  var car_price = req.body.car_price;

  //차 판매 등록 날짜
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  var created_date = date + ' ' + time;

  var datas = [seller_id, car_number, car_title, car_price, car_year, car_mileage, car_fuel, car_info, image, created_date];

  var sql = "INSERT INTO car(seller_id, car_number, car_title, car_price, car_year, car_mileage, car_fuel, car_info, image, created_date) values(?,?,?,?,?,?,?,?,?,?)";
  connection.query(sql, datas, function (err, result) {
    if (err) console.log("err: ", err);
    res.redirect('/auth');
  })
});

router.get('/buy', function (req, res, next) {
  if (req.session.loggedin) {
    var car_id = req.query.car_id;
    var sql = "SELECT * FROM car WHERE car_id = ? ";
    connection.query(sql, [car_id], function (err, result) {
      if (err) console.log(err);
      res.render('buy', { title: "자동차", name: user_name, row: result });
    })
  } else {
    req.flash('success', '먼저 로그인해 주세요!');
    res.redirect('/auth/login');
  }
});


router.get('/buy/comment', function (req, res, next) {
  if (req.session.loggedin) {
    var user_id = req.query.seller_id;
    console.log(user_id);
    res.send(user_id);
  } else {
    req.flash('success', '먼저 로그인해 주세요!');
    res.redirect('/auth/login');
  }
});


//display home page
router.get('/', function (req, res, next) {

  if (req.session.loggedin) {
    var sql = "SELECT * FROM car";
    connection.connect(function (err) {
      if (err) console.log("err: ", err);
      connection.query(sql, function (err, rows) {
        if (err) console.log("err: ", err);
        res.render('logged_index', { title: 'O-Car', name: user_name, rows: rows });
      });

    });
  } else {
    res.redirect('/');
  }
});

// Logout user
router.get('/logout', function (req, res) {
  req.session.destroy();
  req.flash('success', '여기에서 다시 로그인해 주세요!');
  res.redirect('/auth/login');
});
module.exports = router;
