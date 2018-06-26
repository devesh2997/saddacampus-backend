var express = require('express');
var router = express.Router();
var controller = require('./controller');
var VerifyToken = require('../VerifyToken');

router.post('/auth',controller.auth);
router.post('/create',VerifyToken.allowCore,controller.create);

module.exports = router;


