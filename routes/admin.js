const { name } = require('ejs');
var express = require('express');
var router = express.Router();
var connection = require('../models/database');


/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.loggedin == true) {
        connection.query('SELECT * FROM user', function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
            res.render('admin', { title: 'Administrator Page', rows: rows });
        });
    } else {
        res.redirect('/admin/login');
    }
});

/* GET Login page. */
router.get('/login', function (req, res, next) {
    res.render('adminLogin', { title: 'Administrator Login', userID: '', password: '' });
    req.session.loggedin = false;
});

//authenticate user
router.post('/authentication', function (req, res, next) {
    var userID = req.body.userID;
    var password = req.body.password;


    if (userID == 'admin' && password == 'admin') {//if user found
        // render to views/index.ejs template file
        req.session.loggedin = true;
        req.session.name = name;
        res.redirect('/admin');
    } else {
        //if user not found
        req.flash('error', '아이디 및 비밀번호를 다시 확인해 주세요!!');
        res.redirect('/admin/login');
    }
});

/* Get User Page*/
router.get('/detail/user/:user_name', function (req, res, next) {
    var user_name = req.params.user_name;
    var sql = "SELECT * FROM user WHERE user_name = ?";
    connection.query(sql, [user_name], function (err, row) {
        if (err) console.error(err);
        console.log("조회 결과 확인 : ", row);
        res.render('detail', { title: "회원 조회", row: row[0] });
    });
});

router.post('/delete-user', function (req, res, next) {
    var user_name = req.body.user_name;
    var sql = "DELETE FROM users WHERE user_name = ?";
    connection.query(sql, [user_name], function (err, row) {
        if (err) console.error(err);
        console.log("삭제된 회윈 : ", row);
        res.redirect('/admin');
    });
});

// Logout user
router.get('/logout', function (req, res) {
    req.session.destroy();
    req.flash('success', '여기에서 다시 로그인해 주세요!');
    res.redirect('/admin/login');
});

module.exports = router;