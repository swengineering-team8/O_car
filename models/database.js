var mysql = require('mysql');

//Database를 만들었으면 정보를 추가해 주세요
var db = mysql.createConnection({
  host: 'kwseocar-mysql.ck8evyabhic9.ap-northeast-2.rds.amazonaws.com',
  user: 'root',
  password: 'ocar2022', //'Tungbg@97',
  database: 'o_car'
});

db.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log('Connected!:)');
  }
});

module.exports = db;