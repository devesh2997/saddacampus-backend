require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./src/app/lib/sadda-db');
var version_router = require('./version_router');
var app = express();

var port = process.env.PORT ||  3000;

var Admin = require('./src/app/models/Admin');
var Roles = require('./src/admin/membership/config/roles');
var jwt = require('jsonwebtoken');

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
		var admin_id;
		if(Admin.findByUsername({username: 'saddacampussuper'},function(err, result){
			if(!result.Admin){
				Admin.create({
					username: 'saddacampussuper',
					email: 'saddacampus@gmail.com',
					password: 'Campusjoy69',
					role: Roles.SUPER
				}, function(err, result){
					admin_id = result.Admin.admin_id;
					console.log(jwt.sign({admin_id: admin_id}, process.env.JWT_SECRET));
					app.listen(port, function() {
						console.log('Listening on port 3000...');
					});
				});
			}else{
				console.log(jwt.sign({admin_id: admin_id}, process.env.JWT_SECRET));
				app.listen(port, function() {
					console.log('Listening on port 3000...');
				});
			}
		}));
    }
});
