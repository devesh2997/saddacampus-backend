var express = require('express');
var router = express.Router();
var controller = require('./controller');
var VerifyToken = require('../VerifyToken');

router.get('/membership',VerifyToken.allowCore,controller.getMembershipData);

module.exports = router;


