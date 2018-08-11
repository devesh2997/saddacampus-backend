var express = require('express');

var router = express.Router();

var AdminMembership = require('./membership');
var adminMembership = new AdminMembership();
var MerchantManagement = require('./merchant-management');
var Analytics = require('./analytics');
var Food = require('./food');

router.use('/membership',adminMembership.router);
router.use('/merchants',MerchantManagement.router);
router.use('/analytics',Analytics.router);
router.use('/food',Food.router);

module.exports = router;
