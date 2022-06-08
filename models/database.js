var mysql = require('mysql');

//Database를 만들었으면 정보를 추가해 주세요
var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '1234', //'Tungbg@97',
    database: 'o_car'
});

db.connect(function(error){
    if(!!error){
      console.log(error);
    }else{
      console.log('Connected!:)');
    }
  });

module.exports = db;