var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "workspacy",
  password: "",
  database: "deals"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE deals (id INT AUTO_INCREMENT PRIMARY KEY, Coupon_ID VARCHAR(255), Campaign_ID VARCHAR(255), Campaign_Name VARCHAR(255), Title VARCHAR(255), Description TEXT, Category VARCHAR(255), Type VARCHAR(255), Type_Value VARCHAR(255), Tracking_URL TEXT)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});