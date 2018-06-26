var express = require('express');
var router = express.Router();
var controller = require('./controller');
var VerifyToken = require('../VerifyToken');

router.post('/create',VerifyToken.allowCore,controller.create);

module.exports = router;


