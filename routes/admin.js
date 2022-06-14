const { name } = require('ejs');
var express = require('express');
const { render } = require('express/lib/response');
var router = express.Router();
var connection = require('../models/database');


/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.logged) {
        res.redirect('/admin/login');
    } else {
        var sql = "select * from car";
        connection.query(sql, function (err, rows) {
            if (err) console.log("err : ", err);
            res.render('admin', { title: 'Administrator', rows: rows });
        })
    }
});

router.post('/car-delete', function (req, res, next) {
    var car_id = req.body.car_id;
    console.log(car_id);
    var sql = "DELETE FROM car WHERE car_id = ?";
    connection.query(sql, [car_id], function (err, result) {
        if (err) console.log("ERR: ", err);
        res.redirect('/admin');
    });
});

/* GET Login page. */
router.get('/login', function (req, res, next) {
    res.render('adminLogin', { title: 'Administrator Login', userID: '', password: '' });
    req.session.logged = false;
});

//authenticate user
router.post('/authentication', function (req, res, next) {
    var userID = req.body.userID;
    var password = req.body.password;


    if (userID == 'admin' && password == 'admin') {//if user found
        // render to views/index.ejs template file
        req.session.logged = true;
        req.session.name = name;
        res.redirect('/admin');
    } else {
        //if user not found
        req.flash('error', '아이디 및 비밀번호를 다시 확인해 주세요!!');
        res.redirect('/admin/login');
    }
});


router.post('/delete-user', function (req, res, next) {
    var user_name = req.body.user_name;
    var sql = "DELETE FROM users WHERE user_name = ?";
    connection.query(sql, [user_name], function (err, row) {
        if (err) console.error(err);
        console.log("삭제된 회윈 : ", id);
        res.redirect('/admin');
    });
});

router.get('/list', function (req, res, next) {
    if (req.session.logged) {
        connection.query('SELECT * FROM user', function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
            res.render('admin_user_list', { title: '회원정보 관리', rows: rows });
        });
    } else {
        res.redirect('/admin/login');
    }
});

router.get('/noticetb', function (req, res, next) {
    if (req.session.logged) {
        connection.query('SELECT * FROM noticetb', function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
            res.render('notice_list', { title: '공지사항 관리', rows: rows });
        });
    } else {
        res.redirect('/admin/login');
    }
});

router.get('/noticetb-write', function (req, res, next) {
    if (req.session.logged) {
        connection.query('SELECT * FROM noticetb', function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
            res.render('notice_write', { title: '공지사항 쓰기', rows: rows });
        });
    } else {
        res.redirect('/admin/login');
    }
});

router.post('/noticetb-write-post', function (req, res, next) {
    var notice_title = req.body.notice_title || req.query.notice_title;
    var notice_content = req.body.notice_content || req.query.notice_content;

    //공지사항 쓴 날짜
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var data = [notice_title, notice_content, date];
    var sql = "INSERT INTO noticetb(notice_title,notice_content,notice_time) VALUES(?,?,?)";

    connection.query(sql, data, function (err, result) {
        if (err) console.log("err : ", err);
        if (result) {
            res.redirect('/admin/noticetb');
        }
    })
});

router.get('/noticetb-read/:id', function (req, res, next) {

    if (req.session.logged) {
        var id = req.params.id;
        var sql = "SELECT * FROM noticetb WHERE notice_id = ?"
        connection.query(sql, id, function (err, rows) {
            if (err) console.log("err : ", err);
            res.render('notice_read', { title: '공지사항', rows: rows });
        })
    } else {
        res.redirect('/admin/login');
    }
});


router.get('/noticetb-update/:id', function (req, res, next) {

    if (req.session.logged) {
        var id = req.params.id;
        var sql = "SELECT * FROM noticetb WHERE notice_id = ?"
        connection.query(sql, id, function (err, rows) {
            if (err) console.log("err : ", err);
            res.render('notice_update', { title: '공지사항 수정', rows: rows });
        })
    } else {
        res.redirect('/admin/login');
    }
});

router.post('/noticetb-update-post', function (req, res, next) {
    var notice_id = req.body.notice_id || req.query.notice_id;
    var notice_title = req.body.notice_title || req.query.notice_title;
    var notice_content = req.body.notice_content || req.query.notice_content;

    //공지사항 쓴 날짜
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var data = [notice_title, notice_content, date, notice_id];
    var sql = "UPDATE noticetb SET notice_title=?, notice_content=?, notice_time=? WHERE notice_id=?";

    connection.query(sql, data, function (err, result) {
        if (err) console.log("err : ", err);
        if (result) {
            res.redirect('/admin/noticetb');
        }
    });
});

router.post('/noticetb-delete', function (req, res, next) {
    var delete_id = req.body.delete_id;
    var sql = "DELETE FROM noticetb WHERE notice_id = ?";
    connection.query(sql, [delete_id], function (err, result) {
        if (err) console.log("err : ", err);
        res.redirect('/admin/noticetb');
    });
});

router.get('/contact-list', function (req, res, next) {
    var sql = "select * from questions";
    connection.query(sql, function (err, rows) {
        if (err) console.log('err: ', err);
        res.render('contact_list', { title: "문의 관리", rows: rows });

    })
});

router.post('/delete-qst', function (req, res, next) {
    var qst_id = req.body.qst_id;
    var sql = "DELETE FROM questions WHERE qst_id = ?";
    connection.query(sql, [qst_id], function (err, result) {
        if (err) console.log("err : ", err);
        res.redirect('/admin/contact-list');
    });
})

// Logout user
router.get('/logout', function (req, res) {
    req.session.destroy();
    req.flash('success', '여기에서 다시 로그인해 주세요!');
    res.redirect('/admin/login');
});

module.exports = router;