var express = require("express");
var app = express();
var request    = require("request");

const { limit, substr } = require('stringz');   

app.set("view engine","ejs");

var categories=["Food & Beverages","E-Commerce","Jewlery & Watches","Travel & Tours","Apparel & Accessories"];  // Coupon Categories to be shown
var featuredCoupon_ID=["IW12390","IW12446","IW12566"];  // Featured Coupon's Coupon_ID to be shown

// Function to find out current date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 

today = yyyy + '-' + mm + '-' + dd;

// Get Coupons Function
app.get("/coupons",function(req,res){
   var api_key="467e7933a50c5ad5e75664bf04bc3545";
   var url= "http://assets.icubeswire.com/dealscoupons/api/getcoupon.php?API_KEY="+api_key;
   request(url,function(error,response,body){
        if(!error && response.statusCode == 200){
            var length = body.length - 6;                         // function to reduce String Size
            var string = limit(body, length);                     // function to reduce String Size
            var api_string=limit(string,length + 1 , ']');        // function to reduce String Size
            var data = JSON.parse(api_string);
            var coupons = data;
           res.render("coupons",{couponCategory:categories, Coupon:coupons,featuredCoupons:featuredCoupon_ID,current_date:today});
        }
    });
});
;
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server has Started"); 
});