var express = require('express');

var v1 = express.Router();


var Membership = require('./src/client/membership');
var membership = new Membership();

var AdminMembership = require('./src/admin/membership');
var adminMembership = new AdminMembership();

v1.use('/membership', membership.router);
v1.use('/membership/admin',adminMembership.router);

exports.v1 = v1;
