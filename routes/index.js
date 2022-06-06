var express = require('express');
var router = express.Router();
var connection = require('../models/database');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'O-Car' });
});

router.get('/search', function (req, res) {
  var name = req.query.name;

  var sql = "SELECT * FROM users WHERE userName LIKE '%" + name + "%'";

  connection.connect(function (err) {
    if (err) console.log("err: ", err);
    connection.query(sql, function (err, result) {
      if (err) console.log("err: ", err);
      res.render('search', { title: "Search", rows: result });
    });

  });

});

module.exports = router;
