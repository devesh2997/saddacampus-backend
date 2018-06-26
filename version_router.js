var express = require('express');

var v1 = express.Router();


var Membership = require('./src/client/membership');
var membership = new Membership();

v1.use('/membership', membership.router);

var AdminMembership = require('./src/admin/membership');
var adminMembership = new AdminMembership();
var MerchantManagement = require('./src/admin/merchant-management');

v1.use('/admin/membership',adminMembership.router);
v1.use('/admin/merchant',MerchantManagement.router);

exports.v1 = v1;
