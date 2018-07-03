var express = require('express');

var v1 = express.Router();


var Membership = require('./src/client/membership');
var membership = new Membership();

v1.use('/membership', membership.router);

var Admin = require('./src/admin');

v1.use('/admin',Admin.router);

exports.v1 = v1;
