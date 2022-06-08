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
  res.render('index', { title: 'O-Car' });
});

router.get('/search', function (req, res) {
  var title = req.query.title;

  var sql = "SELECT * FROM car WHERE title LIKE '%" + title + "%'";

  connection.connect(function (err) {
    if (err) console.log("err: ", err);
    connection.query(sql, function (err, result) {
      if (err) console.log("err: ", err);
      res.render('search', { title: "Search", rows: result });
    });

  });

});

module.exports = router;
