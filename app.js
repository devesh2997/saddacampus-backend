require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./src/app/lib/sadda-db');
var version_router = require('./version_router');
var app = express();
 
var port = process.env.PORT ||  3000;


app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use('/v1', version_router.v1);



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