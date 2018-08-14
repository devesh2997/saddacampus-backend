var express = require('express');

var router = express.Router();

var AdminMembership = require('./membership');
var adminMembership = new AdminMembership();
var MerchantManagement = require('./merchant-management');
var Analytics = require('./analytics');
var Food = require('./food');
var User = require('./User');
var Institute = require('./Institute');
var State = require('./State');
var City = require('./City');
var Restaurant = require('./restaurant-managment');
var Business = require('./business-managment');
var InstituteBusiness = require('./institute-business');

router.use('/membership',adminMembership.router);
router.use('/merchants',MerchantManagement.router);
router.use('/analytics',Analytics.router);
router.use('/food',Food.router);
router.use('/User',User.router);
router.use('/Institute',Institute.router);
router.use('/State',State.router);
router.use('/City',City.router);
router.use('/Restaurant',Restaurant.router);
router.use('/business',Business.router);
router.use('/institute_business',InstituteBusiness.router);

module.exports = router;
