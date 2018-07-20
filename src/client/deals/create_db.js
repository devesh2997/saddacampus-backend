var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "workspacy",
  password: ""
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE deals", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});