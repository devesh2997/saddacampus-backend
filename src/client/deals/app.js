var express = require("express");
var app = express();
var request    = require("request");
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "workspacy",
  password: "",
  database: "deals"
});
const { limit, substr } = require('stringz'); 

app.set("view engine","ejs");
var values = [];
// Date Function starts
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd;
} 

if(mm<10) {
    mm = '0'+mm;
} 

today = yyyy + '-' + mm + '-' + dd;
// Date Function ends

// Get Coupons Function
   var api_key="467e7933a50c5ad5e75664bf04bc3545";
   var url= "http://assets.icubeswire.com/dealscoupons/api/getcoupon.php?API_KEY="+api_key;
   request(url,function(error,response,body){
        if(!error && response.statusCode == 200){
            var length = body.length - 6;                         // function to reduce String Size
            var string = limit(body, length);                     // function to reduce String Size
            var api_string=limit(string,length + 1 , ']');        // function to reduce String Size
            var data = JSON.parse(api_string);
               con.connect(function(err) {
               if (err) throw err;
               console.log("Connected!");
               console.log(data.length);
               var sql = "INSERT INTO deals (Coupon_ID, Campaign_ID,Campaign_Name,Title,Description,Category,Type,Type_Value,Tracking_URL) VALUES ?";
               for(var i=0;i<data.length;i++){
                  if(data[i].Expiry_Date >=today){
               values.push(
                   [data[i].Coupon_ID,data[i].Campaign_ID,data[i].Campaign_Name,data[i].Title,data[i].Description,data[i].Category,data[i].Type,data[i].Type_Value,data[i].Tracking_URL]
                   );
                                                 }
                                             }
               con.query(sql,[values], function (err, result) {
        if (err) throw err;
        console.log("No. of records inserted: "+ result.affectedRows);
   });
});

        }
    });

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server has Started"); 
});