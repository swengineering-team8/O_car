var express = require('express');
var router = express.Router();
var connection = require('../models/database');
var multer = require('multer');
var path = require('path');

//Image Loading

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext);
  },
});

var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function (req, res, next) {
  var sql = "SELECT * FROM noticetb";
  // connection.connect(function (err) {
  //   if (err) console.log("err: ", err);
    connection.query(sql, function (err, rows) {
      if (err) console.log("err: ", err);
      res.render('index', { title: 'O-Car', rows: rows });
    });

  // });
});


module.exports = router;
