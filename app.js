var express = require('express');
var bodyParser = require('body-parser');
var Membership = require('./src/membership');
var db = require('./src/app/lib/sadda-db');

var app = express();
 
var port = process.env.PORT ||  3000;

app.use( bodyParser.json({ type: 'application/json' }) );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var membership = new Membership();
app.use('/membership', membership.router);


app.post('/login',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  console.log(req.body);
  res.send(req.body);
});


// app.get('/', function(req,res){
//     res.redirect('/membership');
// });

db.connect(db.MODE_TEST, function(err) {
    if (err) {
      console.log('Unable to connect to MySQL.');
      process.exit(1);
    } else {
      app.listen(port, function() {
        console.log('Listening on port 3000...');
      });
    }
});