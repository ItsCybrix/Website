var mysql = require('mysql2');
const config = require('dotenv').config();


var db = mysql.createConnection({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

module.exports = db