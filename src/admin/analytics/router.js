var express = require('express');
var router = express.Router();
var controller = require('./controller');
var VerifyToken = require('../VerifyToken');

router.get('/membership/totalUser',VerifyToken.allowCore,controller.getTotalUser);
router.get('/membership/previousWeek',VerifyToken.allowCore,controller.previousWeekRegistered);
router.get('/membership/previousMonth',VerifyToken.allowCore,controller.previousMonthRegistered);
router.post('/membership/custom',VerifyToken.allowCore,controller.custom);

module.exports = router;


