var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "workspacy",
  password: "",
  database: "deals"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT Coupon_ID, Campaign_ID,Campaign_Name,Title,Description,Category,Type,Type_Value,Tracking_URL FROM deals", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});