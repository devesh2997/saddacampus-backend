var express = require('express');

var v1 = express.Router();


var Membership = require('./src/membership');
var membership = new Membership();

v1.use('/membership', membership.router);

exports.v1 = v1;