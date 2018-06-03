require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var Membership = require('./src/membership');
var db = require('./src/app/lib/sadda-db');

var app = express();
 
var port = process.env.PORT ||  3000;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var membership = new Membership();
app.use('/membership', membership.router);



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