var express = require('express');

var router = express.Router();

var AdminMembership = require('./membership');
var adminMembership = new AdminMembership();
var MerchantManagement = require('./merchant-management');
var Analytics = require('./analytics');

router.use('/membership',adminMembership.router);
router.use('/merchant',MerchantManagement.router);
router.use('/analytics',Analytics.router);

module.exports = router;
