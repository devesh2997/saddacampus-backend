var express = require('express');

var Membership = require('./src/membership');
var db = require('./src/sadda-db');


var app = express();
 
var port = process.env.PORT ||  3000;

var membership = new Membership();

app.use('/membership', membership.router);

app.get('/', function(req,res){
    res.redirect('/membership');
});

db.connect(db.MODE_PRODUCTION, function(err) {
    if (err) {
      console.log('Unable to connect to MySQL.');
      process.exit(1);
    } else {
      app.listen(port, function() {
        console.log('Listening on port 3000...');
      });
    }
});