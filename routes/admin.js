const { name } = require('ejs');
var express = require('express');
var router = express.Router();
var connection = require('../models/database');


/* GET home page. */
router.get('/', function (req, res, next) {
    var sql = 'SELECT * FROM user';
    if (req.session.loggedin == true) {
        connection.query(sql, function (err, rows) {
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
    res.render('adminLogin', { title: 'Administrator Login', email: '', password: '' });
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
router.get('/detail/user/:id', function (req, res, next) {
    var id = req.params.id;
    var sql = "SELECT * FROM user WHERE user_id =?";
    connection.query(sql, [id], function (err, row) {
        if (err) console.error(err);
        console.log("조회 결과 확인 : ", row);
        res.render('detail', { title: "회원 조회", row: row[0] });
    });
});

router.post('/delete-user', function (req, res, next) {
    var id = req.body.id;
    var sql = "DELETE FROM user WHERE user_id = ?";
    connection.query(sql, [id], function (err, row) {
        if (err) console.error(err);
        console.log("삭제된 회윈 : ", id);
        res.redirect('/admin');
    });
});

module.exports = router;